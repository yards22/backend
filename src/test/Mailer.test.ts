require("dotenv").config();
import Mailer from "../pkg/mailer/mailer";

let mailer: Mailer;
beforeAll(async () => {
  const MAIL_HOST = process.env.MAIL_HOST;
  const MAIL_ID = process.env.MAIL_ID;
  const MAIL_PASSWORD = process.env.MAIL_PASSWORD;
  const MAIL_PORT = process.env.MAIL_PORT;

  mailer = new Mailer(
    MAIL_HOST || "",
    Number(MAIL_PORT),
    MAIL_ID || "",
    MAIL_PASSWORD || ""
  );
});

afterAll(async () => {
  mailer.Close();
});
test("test mail", async () => {
  try {
    await mailer.Send("itsmehs07@gmail.com", "Some Subject", "Some Body");
  } catch (err) {
    expect(err).toBe(null);
  }
});
