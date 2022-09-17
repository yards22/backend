import { PrismaClient } from "@prisma/client";
import EAuth from "../entities/auth";
import bcrypt from "bcrypt";
import { GenerateOTP, RandomNumber, RandomString } from "../../util/random";
import { IKVStore } from "../../pkg/kv_store/kv_store";
import verifyGoogleIdTokenAndGetUserData from "../../cmd/http_api/helper";
import { SendMail } from "../../util/mail_dependencies";
import { HerrorStatus } from "../../pkg/herror/status_codes";
import { nextTick } from "process";

const SEC_IN_YEAR = 31536000;
const Token_Length = 64;

interface IResponse {
  statusCode: number;
  message?: string;
}

export default class AuthManager {
  private store;
  private cache: IKVStore;
  constructor(store: PrismaClient, cache: IKVStore) {
    this.store = store;
    this.cache = cache;
  }

  CreateUser(
    mail_id: string,
    username: string,
    password?: string,
    subject_id?: string,
    identity_provider?: string
  ): Promise<EAuth> {
    return this.store.users.create({
      data: {
        mail_id,
        password,
        subject_id,
        identity_provider,
        Profile: {
          create: { username, email_id: mail_id },
        },
      },
    });
  }

  GetUserByMail(mail_id: string): Promise<EAuth | null> {
    return this.store.users.findFirst({
      where: {
        mail_id,
      },
    });
  }

  GetUserById(user_id: number): Promise<EAuth | null> {
    return this.store.users.findFirst({
      where: {
        user_id,
      },
    });
  }


  DeleteScreen(user_id: number, accessToken: string) {
    return this.store.token.deleteMany({
      where: {
        AND: [{ user_id: user_id }, { token_id: accessToken }],
      },
    });
  }

  DeleteAllScreens(user_id: number) {
    return this.store.token.deleteMany({
      where: {
        user_id,
      },
    });
  }

  GetAllScreens(user_id: number) {
    return this.store.token.findMany({
      where: {
        user_id,
      },
    });
  }

  CreateScreen(user_id: number, accessToken: string,expiry:Date) {
    return this.store.token.create({
      data: {
        user_id,
        token_id: accessToken,
        expired_at: expiry
      },
    });
  }

  UpdatePassword(user_id: number, password: string): Promise<EAuth> {
    return this.store.users.update({
      where: {
        user_id,
      },
      data: {
        password,
      },
    });
  }

  UserRegister(
    mail_id: string,
    otp: string,
    password: string
  ): Promise<{
    responseStatus: IResponse;
    userData?: EAuth;
    accessToken?: string;
  }> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.GetUserByMail(mail_id);
        if (!user) {
          const valid_otp: string = await this.CheckForOTPSession(mail_id);
          if (valid_otp === otp) {
            const enc_password: string = await this.HashPassword(password);
            const username: string = GenerateUsername(mail_id);
            const user: EAuth = await this.CreateUser(
              mail_id,
              username,
              enc_password
            );
            const accessToken = await this.CreateSession(Token_Length, user);
            const oneYearFromNow = new Date();
            oneYearFromNow.setMonth(oneYearFromNow.getMonth()+1)
            await this.CreateScreen(user.user_id, accessToken,oneYearFromNow);
            resolve({
              responseStatus: {
                statusCode: HerrorStatus.StatusCreated,
                message: "successful_signup",
              },
              userData: user,
              accessToken,
            });
          } else
            resolve({
              responseStatus: {
                statusCode: HerrorStatus.StatusUnauthorized,
                message: "otp_invalid",
              },
            });
        } else {
          resolve({
            responseStatus: {
              statusCode: HerrorStatus.StatusForbidden,
              message: "user_already_exists",
            },
          });
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  //TODO: change update and insert into a single step inbuilt upsert.

  GoogleLogin(id_token: string): Promise<{
    responseStatus: IResponse;
    userData?: EAuth;
    accessToken?: string;
  }> {
    return new Promise(async (resolve, reject) => {
      try {
        const payload: any = await verifyGoogleIdTokenAndGetUserData(id_token);
        const user: EAuth = await this.UpsertUser(payload.email, payload.sub);
        const accessToken: string = await this.CreateSession(
          Token_Length,
          user
        );
        const oneYearFromNow = new Date();
        oneYearFromNow.setMonth(oneYearFromNow.getMonth()+1)
        await this.CreateScreen(user.user_id, accessToken,oneYearFromNow);
        resolve({
          responseStatus: {
            statusCode: HerrorStatus.StatusOK,
            message: "successful_login",
          },
          userData: user,
          accessToken,
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  UpsertUser(email: string, sub: string): PromiseLike<EAuth> {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await this.GetUserByMail(email);
        if (!user) {
          const username: string = GenerateUsername(email);
          console.log("in upsert user about to create user");
          user = await this.CreateUser(email, username, undefined, sub,"google");
        }
        resolve(user);
      } catch (err) {
        reject(err);
      }
    });
  }

  UserLogin(
    mail_id: string,
    password: string
  ): Promise<{
    responseStatus: IResponse;
    userData?: EAuth;
    accessToken?: string;
  }> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.GetUserByMail(mail_id);
        if (user) {
          const validPassword = await bcrypt.compare(
            password,
            user?.password as string
          );
          if (validPassword) {
            const id: number = user?.user_id;
            const accessToken: string = await this.CreateSession(
              Token_Length,
              user
            );
            const oneYearFromNow = new Date();
            oneYearFromNow.setMonth(oneYearFromNow.getMonth()+1)
            await this.CreateScreen(user.user_id, accessToken,oneYearFromNow);
            resolve({
              responseStatus: {
                statusCode: HerrorStatus.StatusOK,
                message: "successful_login",
              },
              userData: user,
              accessToken,
            });
          } else {
            reject({
              responseStatus: {
                statusCode: HerrorStatus.StatusUnauthorized,
                message: "password_invalid",
              },
            });
          }
        } else {
          reject({
            responseStatus: {
              statusCode: HerrorStatus.StatusForbidden,
              message: "no_user_with_given_mail_exists",
            },
          });
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  OTPGenerationForSignUp(
    mail_id: string
  ): Promise<{ responseStatus: IResponse; userData?: string }> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.GetUserByMail(mail_id);
        if (!user) {
          const otp: string = GenerateOTP();
          await this.CreateOTPSession(mail_id, otp);
          SendMail(mail_id, otp);
          resolve({
            responseStatus: {
              statusCode: HerrorStatus.StatusOK,
              message: "otp_generated",
            },
            userData: otp,
          });
        } else {
          reject({
            responseStatus: {
              statusCode: HerrorStatus.StatusForbidden,
              message: "user_already_exists_in_db",
            },
          });
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  OTPGenerationForForgot(
    mail_id: string
  ): Promise<{ responseStatus: IResponse; userData?: string }> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.GetUserByMail(mail_id);
        if (user) {
          const otp: string = GenerateOTP();
          await this.CreateOTPSession(mail_id, otp);
          SendMail(mail_id, otp);
          resolve({
            responseStatus: {
              statusCode: HerrorStatus.StatusOK,
              message: "otp_generated",
            },
            userData: otp,
          });
        } else {
          resolve({
            responseStatus: {
              statusCode: HerrorStatus.StatusForbidden,
              message: "user_doesnot_exist_in_db",
            },
          });
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  OTPVerificationForSignup(
    mail_id: string,
    otp: string
  ): Promise<{ responseStatus: IResponse }> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.GetUserByMail(mail_id);
        if (!user) {
          const valid_otp: string = await this.CheckForOTPSession(mail_id);
          if (valid_otp == otp)
            resolve({
              responseStatus: {
                statusCode: HerrorStatus.StatusOK,
                message: "successfully_verified",
              },
            });
          else
            resolve({
              responseStatus: {
                statusCode: HerrorStatus.StatusUnauthorized,
                message: "otp_invalid",
              },
            });
        } else {
          resolve({
            responseStatus: {
              statusCode: HerrorStatus.StatusForbidden,
              message: "user_already_exists_in_db",
            },
          });
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  OTPVerificationForForgot(
    mail_id: string,
    otp: string
  ): Promise<{ responseStatus: IResponse }> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.GetUserByMail(mail_id);
        if (user) {
          const valid_otp: string = await this.CheckForOTPSession(mail_id);
          if (valid_otp === otp)
            resolve({
              responseStatus: {
                statusCode: HerrorStatus.StatusOK,
                message: "successfully_verified",
              },
            });
          else
            resolve({
              responseStatus: {
                statusCode: HerrorStatus.StatusUnauthorized,
                message: "otp_invalid",
              },
            });
        } else {
          resolve({
            responseStatus: {
              statusCode: HerrorStatus.StatusForbidden,
              message: "user_doesnot_exists_in_db",
            },
          });
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  LogoutAllScreens(
    mail_id: string,
    otp: string
  ): Promise<{
    responseStatus: IResponse;
  }> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.GetUserByMail(mail_id);
        if (user) {
          const valid_otp: string = await this.CheckForOTPSession(mail_id);
          if (otp === valid_otp) {
            const screens = await this.GetAllScreens(user.user_id);
            // Clear all the sessions
            for (let i = 0; i < screens.length; i++) {
              const accessToken = screens[i].token_id;
              await this.cache.Delete("token_" + accessToken);
            }

            resolve({
              responseStatus: {
                statusCode: HerrorStatus.StatusOK,
                message: "logged out of all accounts",
              },
            });
          } else {
            reject({
              responseStatus: {
                statusCode: HerrorStatus.StatusUnauthorized,
                message: "otp_invalid",
              },
            });
          }
        } else {
          reject({
            responseStatus: {
              statusCode: HerrorStatus.StatusForbidden,
              message: "user_doesnot_exists_in_db",
            },
          });
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  UpdateUserPassword(
    mail_id: string,
    otp: string,
    password: string
  ): Promise<{
    responseStatus: IResponse;
    userData?: EAuth;
    accessToken?: string;
  }> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.GetUserByMail(mail_id);
        if (user) {
          const valid_otp: string = await this.CheckForOTPSession(mail_id);
          if (valid_otp == otp) {
            const enc_password: string = await this.HashPassword(password);
            const updatedUser: EAuth = await this.UpdatePassword(
              user.user_id,
              enc_password
            );
            const accessToken = await this.CreateSession(Token_Length, user);
            resolve({
              responseStatus: {
                statusCode: HerrorStatus.StatusOK,
                message: "successful_password_update",
              },
              userData: updatedUser,
              accessToken,
            });
          } else
            reject({
              responseStatus: {
                statusCode: HerrorStatus.StatusUnauthorized,
                message: "otp_invalid",
              },
            });
        } else {
          reject({
            responseStatus: {
              statusCode: HerrorStatus.StatusForbidden,
              message: "user_doesnot_exists_in_db",
            },
          });
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  CreateOTPSession(mail_id: string, otp: string) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.cache.Set("otp_" + mail_id, otp, 300);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  CheckForOTPSession(mail_id: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const otp: any = await this.cache.Get("otp_" + mail_id);
        resolve(otp);
      } catch (err) {
        reject(err);
      }
    });
  }

  CreateSession(n: number, user: EAuth): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        let token: string = RandomString(n);
        let isExists: any = true;
        while (isExists) {
          console.log("into create session ");
          isExists = await this.cache.Get("token_" + token);
          token = RandomString(n);
        }
        const userStringified: string = JSON.stringify(user);
        this.cache.Set("token_" + token, userStringified, SEC_IN_YEAR);
        resolve(token);
      } catch (err) {
        reject(err);
      }
    });
  }

  LogoutUser(
    user_id: number,
    token: string
  ): Promise<{ responseStatus: IResponse }> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.cache.Delete("token_" + token);
        await this.DeleteScreen(user_id, token);
        resolve({
          responseStatus: {
            statusCode: HerrorStatus.StatusOK,
            message: "logged_out_successfully",
          },
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  HashPassword(password: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const salt = await bcrypt.genSalt(10);
        const enc_password: string = await bcrypt.hash(password, salt);
        resolve(enc_password);
      } catch (err) {
        reject(err);
      }
    });
  }
}

function GenerateUsername(mail_id: string): string {
  const prefixUsername: string = mail_id.split("@")[0];
  const genRandomNumber: number = RandomNumber(100, 999);
  const username: string = prefixUsername + "_" + genRandomNumber.toString();
  return username;
}
