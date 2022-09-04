import RouteHandler from "./types";
import { Herror } from "../../pkg/herror/herror";
import jwt, { JwtPayload } from "jsonwebtoken";
import { GenerateOTP } from "../../util/random";
import { MailValidator, SendMail } from "../../util/mail_dependencies";

interface IUser {
  user_id: bigint;
  password: string;
  mail_id: string;
  sub_id: string;
}

//TODO: check allowance

const HandleSignUp: RouteHandler = async (req, res, next, app) => {
  const mail_id = req.body.mail_id;
  const password = req.body.password;
  if (mail_id === "" || password === "") {
    next(new Herror("improper inputs", 401));
  }
  try {
    // user_already_exists
    // 
    // TODO: PROFILE-TABLE ENTRY AND USER-TABLE ENTRY IN A TRANSACTION
    const result = await app.authManager.RegisterUser(mail_id, password);
    app.SendRes(res, { status: 200, message: "successfully Registered" });
  } catch (err) {
    app.SendRes(res, { status: 500, message: "inernal server error" });
  }
};

const HandleLogin: RouteHandler = async (req, res, next, app) => {
  // sanitize and validate the input parameters
  const mail_id = req.body.mail_id;
  const password = req.body.password;
  const token = req.body.token;
  if (mail_id === "" || password === "") {
    next(new Herror("improper login credentials", 401));
  }
  try {
    const result = await app.authManager.LoginUser(mail_id, password, token);
    if (result === "Login Successful") {
      app.SendRes(res, { status: 200, message: "successful login" });
    } else {
      app.SendRes(res, { status: 401, message: "Invalid credentials" });
    }
  } catch (err) {
    app.SendRes(res, { status: 500, message: "inernal server error" });
  }
};

const HandleGoogleOauth: RouteHandler = async (req, res, next, app) => {
  const payload: JwtPayload = jwt.decode(req.body.id_token) as JwtPayload;
  try {
    const user: IUser = (await app.authManager.Upsert(
      payload.email,
      payload.sub as string,
      "google-identity"
    )) as IUser;
    const token = await app.authManager.CreateToken(64, user?.user_id);
    app.SendRes(res, {
      status: 200,
      data: {},
      message: "successful signup follwed by signin",
    });
  } catch (err) {
    next(err);
  }
};

const HandleOTPGeneration: RouteHandler = async (req, res, next, app) => {
  const mail_id = req.body.mail_id;
  const valid: boolean = MailValidator(mail_id);
  if (valid) {
    // check if mail is already existing or not.
    const user = await app.authManager.getUser(mail_id);
    try {
      if (!user) {
        const otp: string = GenerateOTP();
        try {
          await app.authManager.CreateOTPSession(mail_id, otp);
          SendMail(mail_id, otp);
          app.SendRes(res, { status: 200, message: "OTP sent Successfully" });
        } catch (err) {
          next(err);
        }
      } else {
        app.SendRes(res, {
          status: 401,
          message:
            "user unauthorised for this action as accnt with this mail is already existing",
        });
      }
    } catch (err) {
      next(err);
    }
  } else {
    app.SendRes(res, { status: 200, message: "improper MailId" });
  }
};

const HandleOTPVerification: RouteHandler = async (req, res, next, app) => {
  const mail_id: string = req.body.mail_id;
  const OTP: string = req.body.OTP;
  const valid: boolean = MailValidator(mail_id);
  if (valid) {
    const getOTP = await app.authManager.CheckForOTPSession(mail_id);
    if (getOTP === OTP) {
      // valid session.
      app.SendRes(res, {
        status: 200,
        message: "MailId Successfully verified",
      });
    } else {
      // session expired.
      app.SendRes(res, {
        status: 401,
        message: "OTP session expired, try with resend OTP option",
      });
    }
  } else {
    app.SendRes(res, { status: 200, message: "improper MailId" });
  }
};

const HandleLogout: RouteHandler = async (req, res, next, app) => {
  const token = req.body.token;
  try {
    await app.authManager.LogoutUser(token);
    app.SendRes(res, { status: 200, message: "user successfully logged out" });
  } catch (err) {
    next(err);
  }
};

const HandleOTPGenerationForForgot: RouteHandler = async (
  req,
  res,
  next,
  app
) => {
  const mail_id = req.body.mail_id;
  const valid: boolean = MailValidator(mail_id);
  if (valid) {
    // check if mail is already existing or not.
    const user = await app.authManager.getUser(mail_id);
    try {
      if (user) {
        const otp: string = GenerateOTP();
        try {
          await app.authManager.CreateOTPSession(mail_id, otp);
          SendMail(mail_id, otp);
          app.SendRes(res, { status: 200, message: "OTP sent Successfully" });
        } catch (err) {
          next(err);
        }
      } else {
        app.SendRes(res, {
          status: 401,
          message:
            "user unauthorised for this action as no accnt with this mail in existance",
        });
      }
    } catch (err) {
      next(err);
    }
  } else {
    app.SendRes(res, { status: 200, message: "improper MailId" });
  }
};

const HandlePasswordUpdate: RouteHandler = async (req, res, next, app) => {
  const password = req.body.password;
  const user_id = req.body.user_id;
  try {
    await app.authManager.UpdateUserPassword(user_id, password);
  } catch (err) {
    next(err);
  }
};

const CheckAllowance: RouteHandler = async (req, res, next, app) => {
  // populate req body with user_id,mail_id .....
  const bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== undefined) {
    const bearer = bearerHeader?.split(" ") as string[];
    const bearerToken = bearer[1];
    try {
      const user: IUser = (await app.authManager.CheckForSession(
        bearerToken
      )) as IUser;
      req.body.token = bearerToken;
      req.body.user_id = user.user_id;
    } catch (err) {
      next(err);
    }
  }
};

export {
  HandleSignUp,
  HandleLogin,
  HandleGoogleOauth,
  HandleOTPGeneration,
  HandleOTPVerification,
  HandleLogout,
  HandleOTPGenerationForForgot,
  HandlePasswordUpdate,
  CheckAllowance,
};
