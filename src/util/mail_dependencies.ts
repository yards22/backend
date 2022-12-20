import EmailValidator from "email-validator";
import nodemailer from "nodemailer";

const MAIL_SERVICE = process.env.MAIL_SERVICE;
const MAIL_ID = process.env.MAIL_ID;
const MAIL_PASSWORD = process.env.MAIL_PASSWORD;
const MAIL_PORT = process.env.MAIL_PORT;

function MailValidator(mail_id: string): boolean {
  return EmailValidator.validate(mail_id);
}

function SendMail(mail_id: string, otp: string): void {
  const transporter = nodemailer.createTransport({
    service: MAIL_SERVICE,
    port: isNaN(Number(MAIL_PORT)) ? 587 : Number(MAIL_PORT),
    auth: {
      user: MAIL_ID,
      pass: MAIL_PASSWORD,
    },
  });

  const options = {
    from: "project22.yards@outlook.com",
    to: mail_id,
    subject: "MailId verification for 22yards :)",
    text: ` OTP is ${otp}`,
  };

  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info.response);
    }
  });
}

export { MailValidator, SendMail };
