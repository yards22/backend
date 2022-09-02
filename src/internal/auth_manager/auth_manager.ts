import { Prisma, PrismaClient, Users } from "@prisma/client";
import EAuth from "../entities/auth";
import { createClient,RedisClientType  } from "redis";
import Redis from "../../pkg/kv_store/redis"
import bcrypt from 'bcrypt'
import { RandomString } from "../../util/random";
import { nextTick } from "process";


export default class AuthManager{
    private store;
    private cache:any;
    constructor(store: PrismaClient){
        this.store = store;
        this.ConnectCache();
    }

    async ConnectCache(){
        const store: RedisClientType = createClient({
          url: `redis://localhost:6379`,
      });
      await store.connect();
      this.cache = new Redis(store);
    }

    CreateUser(
      mail_id: string, 
      password:string = "NULL", 
      subject_id:string = "NULL", 
      identity_provider:string = "Self",
      ): Promise<EAuth|null>{
        return this.store.users.create({ data:{mail_id,password,subject_id,identity_provider}});
    }

    CreateUserToken(user_id:bigint,token_id:string){
        return this.store.token.create({data:{user_id,token_id}})
    }

    getUser(mail_id: string): Promise<EAuth|null>{
        return this.store.users.findFirst({
            where:{
                mail_id 
            }
        });
   }

    LoginUser(mail_id: string,password : string, token:string){
      return new Promise(async (resolve,reject)=>{
       try{
            const user = await this.getUser(mail_id);
            const validPassword = await bcrypt.compare(password,user?.password as string);
            if(validPassword){
                const id:bigint = user?.user_id as bigint;
                await this.cache.Set(token,id,60);
                this.CreateUserToken(id,token)
                resolve("Login Successful");
            }
            else{
              resolve("Invalid Credentials");
            }
       }
       catch(err){
           reject(err);
       }

      });
    }

    RegisterUser(mail_id: string, password:string){
      return new Promise(async (resolve,reject)=>{
         try{
           const user = await this.getUser(mail_id);
           if(!user){
              try{
                const salt = await bcrypt.genSalt(10);
                const enc_password: string =  await bcrypt.hash(password, salt);
                await this.CreateUser(mail_id,enc_password);
                resolve("Registered Successfully");
              }
              catch(err){
                reject("Internal server error");
              }
           }
           else{
              resolve("User Already exists");
           }
         }
         catch(err){
             reject("Internal server error");
         }
      })
    }

    Upsert(mail_id:string, sub_id:string,identity_provider:string){
      return new Promise(async (resolve,reject)=>{
          try{
            let user = await this.getUser(mail_id);
            if(!user){
              try{
                user = await this.CreateUser(mail_id,undefined,sub_id,identity_provider);
                resolve(user);
              }
              catch(err){
                reject("Internal server error");
              }
            }
            else{
              
              resolve(user);
            }
          }
          catch(err){
             reject(err);
          }
      })
    }

    CreateToken(n:number,id:bigint){
      return new Promise(async (resolve,reject)=>{
           try{
            let token: string = RandomString(n);
            let isExists:any = true;
            while(isExists){
                isExists = await this.cache.Get(token)
                token = RandomString(n);
            }
            
          await this.cache.Set(token,id.toString(),120); 
          resolve(token);
           }
           catch(err){
            reject(err);
           }
      })
    }

    CreateOTPSession(mail_id : string, otp : string){
       return new Promise(async (resolve,reject)=>{
           try{
            // otp valid for 5 Min .
            await this.cache.Set(mail_id,otp,300); 
            resolve("Session Created");
           }
           catch(err){
             reject(err);
           }
       })
    }

    CheckForSession(mail_id :string){
      return new Promise(async (resolve,reject)=>{
          try{
            const otp:any = await this.cache.Get(mail_id);
            resolve(otp);
          }
          catch(err){
             reject(err);
          }
      })
    }
     
}