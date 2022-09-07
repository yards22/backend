import { PrismaClient } from "@prisma/client";
import EAuth from "../entities/auth";
import bcrypt from "bcrypt";
import { GenerateOTP, RandomNumber, RandomString } from "../../util/random";
import { IKVStore } from "../../pkg/kv_store/kv_store";
import verifyGoogleIdTokenAndGetUserData from "../../cmd/http_api/helper";
import { SendMail } from "../../util/mail_dependencies";
import { HerrorStatus } from "../../pkg/herror/status_codes";

const SEC_IN_YEAR = 31536000;

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
          console.log(valid_otp, otp);
          if (valid_otp === otp) {
            const enc_password: string = await this.HashPassword(password);
            const username: string = GenerateUsername(mail_id);
            const user: EAuth = await this.CreateUser(
              mail_id,
              username,
              enc_password
            );
            const accessToken = await this.CreateSession(64, user);
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
        const accessToken: string = await this.CreateSession(64, user);
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
          user = await this.CreateUser(email, username, undefined, sub);
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
            const accessToken: string = await this.CreateSession(64, user);
            resolve({
              responseStatus: {
                statusCode: HerrorStatus.StatusOK,
                message: "successful_login",
              },
              userData: user,
              accessToken,
            });
          } else {
            resolve({
              responseStatus: {
                statusCode: HerrorStatus.StatusUnauthorized,
                message: "password_invalid",
              },
            });
          }
        } else {
          resolve({
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
        console.log(user);
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
            const accessToken = await this.CreateSession(64, user);
            resolve({
              responseStatus: {
                statusCode: HerrorStatus.StatusCreated,
                message: "successful_signup",
              },
              userData: updatedUser,
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
        const otp: any = await this.cache.Get(mail_id);
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
          isExists = await this.cache.Get(token);
          token = RandomString(n);
        }
        console.log(user);
        // let modified_user :any = user;
        // modified_user.user_id = modified_user.user_id.toString();
        const userStringified: string = JSON.stringify(user);
        this.cache.Set("token_" + token, userStringified, SEC_IN_YEAR);
        resolve(token);
      } catch (err) {
        reject(err);
      }
    });
  }

  LogoutUser(token: string): Promise<{ responseStatus: IResponse }> {
    return new Promise(async (resolve, reject) => {
      try {
        this.cache.Delete(token);
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
