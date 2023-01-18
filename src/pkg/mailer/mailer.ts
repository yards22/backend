import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
export default class Mailer {
  private host: string;
  private port: number;
  private id: string;
  private password: string;
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor(host: string, port: number, id: string, password: string) {
    this.host = host;
    this.password = password;
    this.id = id;
    this.port = port;

    this.transporter = nodemailer.createTransport({
      host: this.host,
      port: port,
      secure: false,
      requireTLS: false,
      auth: {
        user: this.id,
        pass: this.password,
      },
    });
  }

  Send(to: string, subject: string, body: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const options = {
        from: this.id,
        to: to,
        subject: subject,
        text: body,
      };

      this.transporter.sendMail(options, function (err, info) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  Close() {
    this.transporter.close();
  }
}
