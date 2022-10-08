import { Router } from "express";
import  { App } from "./types";
import multer from "multer";

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
import { 
  CheckAllowance 
} from "./middlewares";
import { 
  HandleGetLikesForPost,
  HandleLikeAndUnlike 
} from "./like";
import {
   HandleCommentReply,
   HandleCreateComment, 
   HandleDeleteComment, 
   HandleDeleteCommentReply, 
   HandleGetComments 
} from "./comment";
import { 
  HandleAddToFavourites,
  HandleCreatePost, HandleDeletePost, HandleGetPosts, HandleShareToTimeline, HandleUpdatePost 
} from "./post";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

function LikeRoutes(app: App): Router {
  const router = Router();
  router.get(
    "/",
    app.InHandler(CheckAllowance),
    app.InHandler(HandleGetLikesForPost)
  );
  router.put(
    "/",
    app.InHandler(CheckAllowance),
    app.InHandler(HandleLikeAndUnlike)
  );
  return router;
}

function CommentRoutes(app:App):Router {

    const router =Router();
    router.get(
      "/",
      app.InHandler(CheckAllowance),
      app.InHandler(HandleGetComments)
    );
    router.post(
      "/",
      app.InHandler(CheckAllowance),
      app.InHandler(HandleCreateComment)
    );

    router.delete(
      '/',
      app.InHandler(CheckAllowance),
      app.InHandler(HandleDeleteComment)
    );
    
    router.post(
      '/reply',
      app.InHandler(CheckAllowance),
      app.InHandler(HandleCommentReply)
    );

    router.delete(
      '/deleteReply',
      app.InHandler(CheckAllowance),
      app.InHandler(HandleDeleteCommentReply)
    );
    return router;
}

function PostRoutes(app:App):Router{
  const router = Router();

  router.post(
    "/",
    app.InHandler(CheckAllowance),
    upload.array("images"),
    app.InHandler(HandleCreatePost)
  );

  router.put(
    "/",
    app.InHandler(CheckAllowance),
    upload.array("images"),
    app.InHandler(HandleUpdatePost)
  );

  router.delete(
    "/",
    app.InHandler(CheckAllowance),
    app.InHandler(HandleDeletePost)
  );

  router.get(
    "/",
    app.InHandler(CheckAllowance),
    app.InHandler(HandleGetPosts)
  );

  router.post(
    "/shareToTimeline",
    app.InHandler(CheckAllowance),
    app.InHandler(HandleShareToTimeline)
  );

  router.post(
    "/addToFavourites",
    app.InHandler(CheckAllowance),
    app.InHandler(HandleAddToFavourites)
  );

  return router;
}

function HandleRoutesFor(app: App) {
  app.srv.use("/notification", NotificationRoutes(app));
  app.srv.use("/profile", ProfileRoutes(app));
  app.srv.use("/auth", AuthRoutes(app));
  app.srv.use("/like", LikeRoutes(app));
  app.srv.use("/comment",CommentRoutes(app));
  app.srv.use("/post",PostRoutes(app));
}

export default HandleRoutesFor;
