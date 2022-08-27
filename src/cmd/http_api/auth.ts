import RouteHandler from "./types";
import Redis from "../../pkg/kv_store/redis"
import { createClient,RedisClientType  } from "redis";

const HandleSignUp : RouteHandler = async (req,res,next,app) =>{
    const mail_id = req.body.mail_id;
    const password = req.body.password;
    try {
      const user = await app.authManager.getUser(mail_id);
      if(!user){
        try{
           await app.authManager.CreateUser(mail_id,password);
           app.SendRes(res,{status:200,message:"Successfully Registered"});
        }
        catch(err){
            next(err)
        }
      }
      else{
         app.SendRes(res,{status:401,message:"user already exists"});
      }
    }
    catch(err){
        next(err);
    }
}

const HandleLogin : RouteHandler = async (req,res,next,app)=>{
    const mail_id = req.body.mail_id;
    const password = req.body.password;
    try{
       const user = await app.authManager.getUser(mail_id);
       if(password===user?.password){
        const store: RedisClientType = createClient({
            url: `redis://localhost:6379`,
          });
          await store.connect();
           const redis = new Redis(store);
           const id:number = 10;
           const userId:string = id.toString(); 
           const key = await redis.Set("first_key",userId,60);
           app.SendRes(res,{status:200,message:"Successful Login"});
       }
       else{
           app.SendRes(res,{status:401,message:"Invalid Creds"});
       }
    }
    catch(err){
        next(err);
    }
}

export {HandleSignUp,HandleLogin};