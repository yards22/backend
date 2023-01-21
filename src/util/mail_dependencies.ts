import EmailValidator from "email-validator";
import nodemailer from "nodemailer";
require("dotenv").config();
const MAIL_HOST = process.env.MAIL_HOST;
const MAIL_ID = process.env.MAIL_ID;
const MAIL_PASSWORD = process.env.MAIL_PASSWORD;
const MAIL_PORT = process.env.MAIL_PORT;

function MailValidator(mail_id: string): boolean {
  return EmailValidator.validate(mail_id);
}

function SendMail(mail_id: string, otp: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port: isNaN(Number(MAIL_PORT)) ? 587 : Number(MAIL_PORT),
      secure: false,
      requireTLS: false,
      auth: {
        user: MAIL_ID,
        pass: MAIL_PASSWORD,
      },
    });

    const options = {
      from: MAIL_ID,
      to: mail_id,
      subject: "MailId verification for 22yards :)",
      text: ` OTP is ${otp}`,
    };

    transporter.sendMail(options, function (err, info) {
      if (err) {
        reject(err);
      } else {
        console.log("done");

        resolve();
      }
    });
  });
}

export { MailValidator, SendMail };
