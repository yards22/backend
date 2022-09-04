import config  from "config";
import EmailValidator from "email-validator"
import nodemailer from "nodemailer"

function MailValidator(mail_id : string) : boolean{
    
    return EmailValidator.validate(mail_id);
}

function SendMail(mail_id: string, otp : string):void{
    const transporter = nodemailer.createTransport({
        service:config.get("service"), // sevice name
        port: config.get("SMTPport"), // port for secure SMTP
        auth: {
            user: config.get("mailId"),
            pass: config.get("password")
        },
      });
    
      const options = {
        from:"project22.yards@outlook.com",
        to:mail_id,
        subject:"MailId verification for 22yards :)" ,
        text:` OTP is ${otp}`
      };

      transporter.sendMail(options,function(err,info){
        if(err){
          console.log(err);
        }
        else{
          console.log(info.response);
        }
      });
}

export {
    MailValidator,
    SendMail
}

