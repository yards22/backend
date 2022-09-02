import RouteHandler from "./types";
import { Herror } from "../../pkg/herror/herror";
import jwt, { JwtPayload } from "jsonwebtoken";
import {GenerateOTP} from "../../util/random"
import {MailValidator,SendMail} from "../../util/mail_dependencies";
 
interface IUser{
  user_id : bigint,
  password : string,
  mail_id : string,
  sub_id : string
}

const HandleSignUp : RouteHandler = async (req,res,next,app) =>{
    const mail_id = req.body.mail_id;
    const password = req.body.password;
    if(mail_id==="" || password===""){
        next(new Herror("improper inputs",401));
    }
    try{
      // TODO: PROFILE-TABLE ENTRY AND USER-TABLE ENTRY IN A TRANSACTION
      const result = await app.authManager.RegisterUser(mail_id,password);
      
      if(result === "Registered Successfully"){
          app.SendRes(res,{status:200,message:"successfully Registered"});
      } 
      else{
          app.SendRes(res,{status:401,message:"User Already exists"});
      }  
    }
    catch(err){
        app.SendRes(res,{status:500,message:"inernal server error"});
    
   }
}

const HandleLogin : RouteHandler = async (req,res,next,app)=>{
    // sanitize and validate the input parameters
    const mail_id = req.body.mail_id;
    const password = req.body.password;
    const token = req.body.token;
    if(mail_id==="" || password===""){
        next(new Herror("improper login credentials",401));
    }
    try{
        const result = await app.authManager.LoginUser(mail_id,password,token);
        if(result === "Login Successful"){
            app.SendRes(res,{status:200,message:"successful login"});
        }
        else{
            app.SendRes(res,{status:401,message:"Invalid credentials"});
        }  
    }
    catch(err){
        app.SendRes(res,{status:500,message:"inernal server error"});
    }
}

const HandleGoogleOauth: RouteHandler = async (req,res,next,app)=>{
   const payload: JwtPayload = jwt.decode(req.body.id_token) as JwtPayload;
   try{
     const user: IUser= await app.authManager.Upsert(payload.email,payload.sub as string,"google-identity") as IUser;
     const token = await app.authManager.CreateToken(64,user?.user_id);
     app.SendRes(res,{status:200,data:token,message:"successful signup follwed by signin"});
   }
   catch(err){
      next(err); 
   }
}

const HandleOTPGeneration: RouteHandler = async( req,res,next,app)=>{
    const mail_id = req.body.mail_id;
    const valid : boolean = MailValidator(mail_id);
    if(valid){
       const otp:string = GenerateOTP();
       try{
        await app.authManager.CreateOTPSession(mail_id,otp);
        SendMail(mail_id,otp);
        app.SendRes(res,{status:200,message:"OTP sent Successfully"});
       }
       catch(err){
         next(err);
       }
    }
    else{
      app.SendRes(res,{status:200,message:"improper MailId"});
    }
}

const HandleOTPVerification: RouteHandler = async(req,res,next,app)=>{
    const mail_id :string = req.body.mail_id;
    const OTP:string = req.body.OTP;
    const valid : boolean = MailValidator(mail_id);
    if(valid){
       const getOTP = await app.authManager.CheckForSession(mail_id);
       if(getOTP === OTP){
            // valid session.
            app.SendRes(res,{status:200,message:"MailId Successfully verified"});
       }
       else{
          // session expired.
          app.SendRes(res,{status:401,message:"OTP session expired, try with resend OTP option"});
       }
    }
    else{
      app.SendRes(res,{status:200,message:"improper MailId"});
    }
}

// const HandleLogout:RouteHandler = async(req,res,next,app)=>{
//      const token = req.body.token;
//      await app.authManager.
// }

export {
  HandleSignUp,
  HandleLogin,
  HandleGoogleOauth,
  HandleOTPGeneration,
  HandleOTPVerification,
  // HandleLogout
};
