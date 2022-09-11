import { Router } from "express";
import {
  HandleGetNotification,
  HandleUpdateNotificationStatus,
} from "./notification";
import {
  HandleSignUp,
  HandleLogin,
  HandleGoogleOauth,
  HandleOTPGenerationForSignUp,
  HandleOTPVerificationForSignUp,
  HandleLogout,
  HandleOTPGeneration,
  HandleOTPVerification,
  HandlePasswordUpdate,
  HandleLogoutAllScreen,
  HandleMe,
} from "./auth";
import { App } from "./types";
import {
  HandleCreateProfile,
  HandleGetUserProfile,
  HandleUpdateProfile,
} from "./profile";
import { CheckAllowance } from "./middlewares";

function NotificationRoutes(app: App): Router {
  const router = Router();
  router.get("/", app.InHandler(HandleGetNotification));
  router.put("/", app.InHandler(HandleUpdateNotificationStatus));
  return router;
}

function AuthRoutes(app: App): Router {
  const router = Router();
  router.get("/", app.InHandler(CheckAllowance), app.InHandler(HandleMe));
  router.post("/signup", app.InHandler(HandleSignUp));
  router.post("/login", app.InHandler(HandleLogin));
  router.post("/oauth", app.InHandler(HandleGoogleOauth));
  router.post("/sendOTP", app.InHandler(HandleOTPGenerationForSignUp));
  router.post("/verifyOTP", app.InHandler(HandleOTPVerificationForSignUp));
  router.delete(
    "/logout",
    app.InHandler(CheckAllowance),
    app.InHandler(HandleLogout)
  );
  router.post("/sendOTPforgot", app.InHandler(HandleOTPGeneration));
  router.post("/verifyOTPforgot", app.InHandler(HandleOTPVerification));
  router.put("/updPassword", app.InHandler(HandlePasswordUpdate));
  router.post("/logoutAllScreens", app.InHandler(HandleLogoutAllScreen));
  return router;
}

function ProfileRoutes(app: App): Router {
  HandleOTPVerificationForSignUp;
  const router = Router();
  router.get("/", app.InHandler(HandleGetUserProfile));
  router.post("/", app.InHandler(HandleCreateProfile));
  router.put("/", app.InHandler(HandleUpdateProfile));
  return router;
}

function HandleRoutesFor(app: App) {
  app.srv.use("/notification", NotificationRoutes(app));
  app.srv.use("/profile", ProfileRoutes(app));
  app.srv.use("/auth", AuthRoutes(app));
}

export default HandleRoutesFor;
