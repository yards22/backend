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
  HandleLogoutAllScreen,
  HandleMe,
} from "./auth";
import {
  HandleUpdateProfile,
  HandleGetUserPrimaryInfo,
  HandleGetUserProfileInfo,
  HandleGetCheckUsername,
} from "./profile";
import { CheckAllowance } from "./middlewares";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import { App } from "./types";
import { 
  GetRecommendations,
  HandleGetFollowers,
  HandleGetFollowing,
  HandleNewConnection,
  HandleRemoveConnection,
  HandleSearches,
} from "./networks";

function NotificationRoutes(app: App): Router {
  const router = Router();
  router.get("/", app.InHandler(HandleGetNotification));
  router.put("/", app.InHandler(HandleUpdateNotificationStatus));
  return router;
}

function AuthRoutes(app: App): Router {
  const router = Router();
  router.get(
    "/", 
    app.InHandler(CheckAllowance), 
    app.InHandler(HandleMe)
  );
  router.post(
    "/signup", 
    app.InHandler(HandleSignUp)
  );
  router.post(
    "/login", 
    app.InHandler(HandleLogin)
  );
  router.post(
    "/oauth", 
    app.InHandler(HandleGoogleOauth)
  );
  router.post(
    "/sendOTP", 
    app.InHandler(HandleOTPGenerationForSignUp)
  );
  router.post(
    "/verifyOTP", 
    app.InHandler(HandleOTPVerificationForSignUp)
  );
  router.delete(
    "/logout",
    app.InHandler(CheckAllowance),
    app.InHandler(HandleLogout)
  );
  router.post(
    "/sendOTPforgot", 
    app.InHandler(HandleOTPGeneration)
  );
  router.post(
    "/verifyOTPforgot", 
    app.InHandler(HandleOTPVerification)
  );
  router.post(
    "/updPassword", 
    app.InHandler(HandlePasswordUpdate)
  );
  router.post(
    "/logoutAllScreens", 
    app.InHandler(HandleLogoutAllScreen)
  );
  return router;
}

function ProfileRoutes(app: App): Router {
  const router = Router();
  router.put(
    "/",
    app.InHandler(CheckAllowance),
    upload.single("image"),
    app.InHandler(HandleUpdateProfile)
  );
  router.get(
    "/editProfile",
    app.InHandler(CheckAllowance),
    app.InHandler(HandleGetUserPrimaryInfo)
  );
  router.get(
    "/",
    app.InHandler(CheckAllowance),
    app.InHandler(HandleGetUserProfileInfo)
  );
  router.post(
    "/checkUsername",
    app.InHandler(CheckAllowance),
    app.InHandler(HandleGetCheckUsername)
  );
  return router;
}

function NetworkRoutes(app:App):Router{
  const router = Router();
  router.get(
    "/",
    app.InHandler(CheckAllowance),
    app.InHandler(GetRecommendations)
  );
  router.post(
    "/",
    app.InHandler(CheckAllowance),
    app.InHandler(HandleNewConnection)
  );
  router.get(
    "/myfollowers",
    app.InHandler(CheckAllowance),
    app.InHandler(HandleGetFollowers)
  );
  router.get(
    "/whoAmIFollowing",
    app.InHandler(CheckAllowance),
    app.InHandler(HandleGetFollowing)
  );
  router.delete(
    "/",
    app.InHandler(CheckAllowance),
    app.InHandler(HandleRemoveConnection)
  );
  return router;
}

function ExploreRoutes(app:App):Router{
  const router = Router();
  router.get(
    "/searchUsers",
    app.InHandler(CheckAllowance),
    app.InHandler(HandleSearches)
  );
  return router;
}

function HandleRoutesFor(app: App) {
  app.srv.use("/notification", NotificationRoutes(app));
  app.srv.use("/profile", ProfileRoutes(app));
  app.srv.use("/auth", AuthRoutes(app));
  app.srv.use("/network",NetworkRoutes(app));
  app.srv.use("/explore",ExploreRoutes(app));
}

export default HandleRoutesFor;
