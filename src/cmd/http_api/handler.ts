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
  HandleOTPGeneration,
  HandleOTPVerification,
  HandleLogout,
  HandlePasswordUpdate,
} from "./auth";
import { App } from "./types";
import { HandleCreateProfile, HandleUpdateProfile } from "./profile";

function NotificationRoutes(app: App): Router {
  const router = Router();
  router.get("/", app.InHandler(HandleGetNotification));
  router.put("/", app.InHandler(HandleUpdateNotificationStatus));
  return router;
}

function AuthRoutes(app:App): Router{
  const router = Router();
  router.post("/signup", app.InHandler(HandleSignUp));
  router.post("/login",app.InHandler(HandleLogin));
  router.post("/oauth",app.InHandler(HandleGoogleOauth));
  router.post("/sendOTP",app.InHandler(HandleOTPGeneration));
  router.post("/verifyOTP",app.InHandler(HandleOTPVerification));
  router.post("/logout",app.InHandler(HandleLogout));
  // router.post("/sendOTPforgot",app.InHandler(HandleOTPGenerationForForgot));
  router.post("/updpassword",app.InHandler(HandlePasswordUpdate));
  return router;
}

function ProfileRoutes(app: App): Router {
  const router = Router();
  router.post("/",app.InHandler(HandleCreateProfile));
  router.put("/",app.InHandler(HandleUpdateProfile));
  return router;
}

function HandleRoutesFor(app: App) {
   app.srv.use("/notification", NotificationRoutes(app));
   app.srv.use("/profile",ProfileRoutes(app));
   app.srv.use("/auth", AuthRoutes(app));
 }
 
export default HandleRoutesFor;
