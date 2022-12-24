"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMail = exports.MailValidator = void 0;
var config_1 = __importDefault(require("config"));
var email_validator_1 = __importDefault(require("email-validator"));
var nodemailer_1 = __importDefault(require("nodemailer"));
function MailValidator(mail_id) {
    return email_validator_1.default.validate(mail_id);
}
exports.MailValidator = MailValidator;
function SendMail(mail_id, otp) {
    var transporter = nodemailer_1.default.createTransport({
        service: config_1.default.get("service"),
        port: config_1.default.get("SMTPport"),
        auth: {
            user: config_1.default.get("mailId"),
            pass: config_1.default.get("password"),
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
