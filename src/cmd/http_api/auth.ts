import RouteHandler, { App, AppRouter } from "./types";
import { Herror } from "../../pkg/herror/herror";
import { MailValidator } from "../../util/mail_dependencies";
import { HerrorStatus } from "../../pkg/herror/status_codes";
import { CheckAllowance } from "./middleware";

export function AuthRoutes(app: App) {
  const appRouter = new AppRouter(app, CheckAllowance);
  appRouter.Get("/", HandleMe);
  appRouter.Post("/signup", HandleSignUp, false);
  appRouter.Post("/login", HandleLogin, false);
  appRouter.Post("/oauth", HandleGoogleOauth, false);
  appRouter.Post("/otp/request/:for", HandleRequestOTP, false);
  appRouter.Post("/otp/verify/:for", HandleOTPVerification, false);
  appRouter.Put("/password/update", HandlePasswordUpdate, false);
  appRouter.Delete("/logout", HandleLogout);
  appRouter.Post("/logout/all", HandleLogoutAllScreen, false);
  return appRouter.NativeRouter();
}

const HandleSignUp: RouteHandler = async (req, res, next, app) => {
  const mail_id = req.body.mail_id;
  const password = req.body.password;
  const otp = req.body.OTP;
  if (mail_id === undefined || password === undefined) {
    next(new Herror("BadRequest", HerrorStatus.StatusBadRequest));
  } else {
    try {
      const { responseStatus, userData, accessToken } =
        await app.authManager.UserRegister(mail_id, otp, password);
      app.SendRes(res, {
        status: responseStatus.statusCode,
        data: { user_data: userData, token: accessToken },
        message: responseStatus.message,
      });
    } catch (err) {
      next(err);
    }
  }
};

const HandleLogin: RouteHandler = async (req, res, next, app) => {
  const mail_id = req.body.mail_id;
  const password = req.body.password;
  if (mail_id === undefined || password === undefined) {
    next(new Herror("mail_id/password_missing", HerrorStatus.StatusBadRequest));
  } else {
    try {
      const { responseStatus, userData, accessToken } =
        await app.authManager.UserLogin(mail_id, password);
      app.SendRes(res, {
        status: responseStatus.statusCode,
        data: { user_data: userData, token: accessToken },
        message: responseStatus.message,
      });
    } catch (err) {
      next(err);
    }
  }
};

const HandleGoogleOauth: RouteHandler = async (req, res, next, app) => {
  const id_token = req.body.id_token;
  if (id_token != undefined) {
    try {
      const { responseStatus, userData, is_exists, accessToken } =
        await app.authManager.GoogleLogin(id_token);
      app.SendRes(res, {
        status: responseStatus.statusCode,
        data: { user_data: userData, token: accessToken, is_exists },
        message: responseStatus.message,
      });
    } catch (err) {
      next(err);
    }
  } else {
    next(new Herror("BadRequest", HerrorStatus.StatusBadRequest));
  }
};

const HandleRequestOTP: RouteHandler = async (req, res, next, app) => {
  const type = req.params.for;
  const mail_id = req.body.mail_id;
  if (!MailValidator(mail_id))
    return next(new Herror("invalid_mail", HerrorStatus.StatusBadRequest));

  if (type === "signup") {
    try {
      const { responseStatus, userData } =
        await app.authManager.OTPGenerationForSignUp(mail_id);
      app.SendRes(res, {
        status: responseStatus.statusCode,
        message: responseStatus.message,
      });
    } catch (err) {
      next(err);
    }
  } else if (type === "password") {
    try {
      const { responseStatus } = await app.authManager.OTPGenerationForForgot(
        mail_id
      );
      app.SendRes(res, {
        status: responseStatus.statusCode,
        message: responseStatus.message,
      });
    } catch (err) {
      next(err);
    }
  }
};

const HandleOTPVerification: RouteHandler = async (req, res, next, app) => {
  const mail_id: string = req.body.mail_id;
  const OTP: string = req.body.OTP;
  const type = req.params.for;
  const valid: boolean = MailValidator(mail_id);
  if (!MailValidator(mail_id))
    return next(new Herror("invalid_mail", HerrorStatus.StatusBadRequest));
  if (type === "signup")
    try {
      const { responseStatus } = await app.authManager.OTPVerificationForSignup(
        mail_id,
        OTP
      );
      app.SendRes(res, {
        status: responseStatus.statusCode,
        message: responseStatus.message,
      });
    } catch (err) {
      next(err);
    }
  else if (type === "password")
    try {
      const { responseStatus } = await app.authManager.OTPVerificationForForgot(
        mail_id,
        OTP
      );
      app.SendRes(res, {
        status: responseStatus.statusCode,
        message: responseStatus.message,
      });
    } catch (err) {
      next(err);
    }
};

const HandleLogout: RouteHandler = async (req, res, next, app) => {
  const token = req.context.token;
  const user_id = req.context.user_id;
  console.log(user_id, token);
  try {
    const { responseStatus } = await app.authManager.LogoutUser(user_id, token);
    app.SendRes(res, {
      status: responseStatus.statusCode,
      message: responseStatus.message,
    });
  } catch (err) {
    next(err);
  }
};

const HandlePasswordUpdate: RouteHandler = async (req, res, next, app) => {
  const password = req.body.password;
  const mail_id = req.body.mail_id;
  const OTP = req.body.OTP;
  try {
    const { responseStatus, userData, accessToken } =
      await app.authManager.UpdateUserPassword(mail_id, OTP, password);
    app.SendRes(res, {
      status: responseStatus.statusCode,
      data: { user_data: userData, token: accessToken },
      message: responseStatus.message,
    });
  } catch (err) {
    next(err);
  }
};

const HandleLogoutAllScreen: RouteHandler = async (req, res, next, app) => {
  const mail_id: string = req.body.mail_id;
  const OTP: string = req.body.OTP;

  try {
    const { responseStatus } = await app.authManager.LogoutAllScreens(
      mail_id,
      OTP
    );
    app.SendRes(res, {
      status: responseStatus.statusCode,
      message: responseStatus.message,
    });
  } catch (err) {
    next(err);
  }
};

const HandleMe: RouteHandler = async (req, res, next, app) => {
  const data = { ...req.context };
  delete data.token;
  delete data.password;
  app.SendRes(res, { status: HerrorStatus.StatusOK, data });
};
