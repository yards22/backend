import { PrismaClient } from "@prisma/client";
import EAuth from "../entities/auth";
import bcrypt from "bcrypt";
import { RandomString } from "../../util/random";
import { IKVStore } from "../../pkg/kv_store/kv_store";

export default class AuthManager {
  private store;
  private cache: IKVStore;
  constructor(store: PrismaClient, cache: IKVStore) {
    this.store = store;
    this.cache = cache;
  }

  CreateUser(
    mail_id: string,
    password?: string,
    subject_id?: string,
    identity_provider?: string
  ): Promise<EAuth> {
    return this.store.users.create({
      data: { mail_id, password, subject_id, identity_provider },
    });
  }

  GetUserByMail(mail_id: string): Promise<EAuth | null> {
    return this.store.users.findFirst({
      where: {
        mail_id,
      },
    });
  }

  GetUserById(user_id: bigint): Promise<EAuth | null> {
    return this.store.users.findFirst({
      where: {
        user_id,
      },
    });
  }

  UpdatePassword(user_id: bigint, password: string) {
    return this.store.users.update({
      where: {
        user_id,
      },
      data: {
        password,
      },
    });
  }

  LoginUser(
    credentials: { mail_id: string; password: string } | string
  ): Promise<{ userData: EAuth; accessToken: string }> {
    return new Promise(async (resolve, reject) => {
      if (typeof credentials == "string") {
        // we have id_token
        // implement google login
      } else {
        // we have mail id and password
      }
      try {
        const user = await this.GetUserByMail(mail_id);
        const validPassword = await bcrypt.compare(
          password,
          user?.password as string
        );
        if (validPassword) {
          const id: BigInt = user?.user_id as BigInt;
          this.cache.Set(token, id.toString(), 600);
          resolve("Login Successful");
        } else {
          resolve("Invalid Credentials");
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  UpdateUserPassword(user_id: bigint, password: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const enc_password: string = (await this.HashPassword(
          password
        )) as string;
        await this.UpdatePassword(user_id, enc_password);
        resolve("Registered Successfully");
      } catch (err) {
        reject("Internal server error");
      }
    });
  }

  RegisterUser(mail_id: string, password: string): Promise<EAuth> {
    return new Promise(async (resolve, reject) => {
      try {
        const enc_password: string = (await this.HashPassword(
          password
        )) as string;
        const user = await this.CreateUser(mail_id, enc_password);
        return resolve(user);
      } catch (err) {
        reject(err);
      }
    });
  }

  HashPassword(password: string) {
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

  Upsert(mail_id: string, sub_id: string, identity_provider: string) {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await this.GetUserByMail(mail_id);
        if (!user) {
          try {
            user = await this.CreateUser(
              mail_id,
              undefined,
              sub_id,
              identity_provider
            );
            resolve(user);
          } catch (err) {
            reject("Internal server error");
          }
        } else {
          resolve(user);
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  CreateToken(n: number, id: BigInt) {
    return new Promise(async (resolve, reject) => {
      try {
        let token: string = RandomString(n);
        let isExists: any = true;
        while (isExists) {
          isExists = await this.cache.Get(token);
          token = RandomString(n);
        }
        this.cache.Set(token, id.toString(), 600);
        resolve(token);
      } catch (err) {
        reject(err);
      }
    });
  }

  CreateOTPSession(mail_id: string, otp: string) {
    return new Promise(async (resolve, reject) => {
      try {
        // otp valid for 5 Min .
        await this.cache.Set(mail_id, otp, 300);
        resolve("Session Created");
      } catch (err) {
        reject(err);
      }
    });
  }

  CheckForOTPSession(mail_id: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const otp: any = await this.cache.Get(mail_id);
        resolve(otp);
      } catch (err) {
        reject(err);
      }
    });
  }

  CheckForSession(token: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const session = await this.cache.Get(token);
        if (session) {
          const id: bigint = BigInt(session);
          let user = await this.GetUserById(id);
          resolve(user);
        } else {
          reject("unauthorised user, please login");
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  LogoutUser(token: string) {
    return new Promise(async (resolve, reject) => {
      try {
        this.cache.Delete(token);
        resolve("Logged out");
      } catch (err) {
        reject(err);
      }
    });
  }
}
