"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMail = exports.MailValidator = void 0;
var email_validator_1 = __importDefault(require("email-validator"));
var nodemailer_1 = __importDefault(require("nodemailer"));
var MAIL_SERVICE = process.env.MAIL_SERVICE;
var MAIL_ID = process.env.MAIL_ID;
var MAIL_PASSWORD = process.env.MAIL_PASSWORD;
var MAIL_PORT = process.env.MAIL_PORT;
function MailValidator(mail_id) {
    return email_validator_1.default.validate(mail_id);
}
exports.MailValidator = MailValidator;
function SendMail(mail_id, otp) {
    var transporter = nodemailer_1.default.createTransport({
        service: MAIL_SERVICE,
        port: isNaN(Number(MAIL_PORT)) ? 587 : Number(MAIL_PORT),
        auth: {
            user: MAIL_ID,
            pass: MAIL_PASSWORD,
        },
    });
    var options = {
        from: "project22.yards@outlook.com",
        to: mail_id,
        subject: "MailId verification for 22yards :)",
        text: " OTP is ".concat(otp),
    };
    transporter.sendMail(options, function (err, info) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(info.response);
        }
    });
}
exports.SendMail = SendMail;
