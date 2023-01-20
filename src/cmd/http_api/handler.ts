import { Router } from "express";
import multer from "multer";

import {
  HandleGetNotification,
  HandleGetNotificationUsernames,
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
import { HandleGetLikesForPost, HandleLikeAndUnlike } from "./like";
import {
  HandleCommentReply,
  HandleCreateComment,
  HandleDeleteComment,
  HandleDeleteCommentReply,
  HandleGetComments,
} from "./comment";
import {
  HandleAddToFavourites,
  HandleCreatePost,
  HandleDeletePost,
  HandleGetPostById,
  HandleGetPosts,
  HandlePostsMetaData,
  HandleShareToTimeline,
  HandleUpdatePost,
} from "./post";
import {
  HandleGetPolls,
  HandlePostPolls,
  HandlePostFeedback,
  HandleGetLeaderBoard,
} from "./misc";

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
import { HandleGetExplore } from "./explore";

function NotificationRoutes(app: App): Router {
  const router = Router();
  router.get(
    "/",
    app.InHandler(CheckAllowance),
    app.InHandler(HandleGetNotification)
  );
  router.put(
    "/",
    app.InHandler(CheckAllowance),
    app.InHandler(HandleUpdateNotificationStatus)
  );
  router.post(
    "/username",
    app.InHandler(CheckAllowance),
    app.InHandler(HandleGetNotificationUsernames)
  );
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
  router.post("/updPassword", app.InHandler(HandlePasswordUpdate));
  router.post("/logoutAllScreens", app.InHandler(HandleLogoutAllScreen));
  return router;
}

function ProfileRoutes(app: App): Router {
  const router = Router();
  router.get(
    "/following",
    app.InHandler(CheckAllowance),
    app.InHandler(HandleGetFollowing)
  );
  router.get(
    "/followers",
    app.InHandler(CheckAllowance),
    app.InHandler(HandleGetFollowers)
  );
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

function CommentRoutes(app: App): Router {
  const router = Router();
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
    "/",
    app.InHandler(CheckAllowance),
    app.InHandler(HandleDeleteComment)
  );

  router.post(
    "/reply",
    app.InHandler(CheckAllowance),
    app.InHandler(HandleCommentReply)
  );

  router.delete(
    "/deleteReply",
    app.InHandler(CheckAllowance),
    app.InHandler(HandleDeleteCommentReply)
  );
  return router;
}

function PostRoutes(app: App): Router {
  const router = Router();
  router.post(
    "/postMeta",
    app.InHandler(CheckAllowance),
    app.InHandler(HandlePostsMetaData)
  );

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
    "/get-by-id",
    app.InHandler(CheckAllowance),
    app.InHandler(HandleGetPostById)
  );

  router.get(
    "/:type",
    app.InHandler(CheckAllowance),
    app.InHandler(HandleGetPosts)
  );

  router.post(
    "/shareToTimeline",
    app.InHandler(CheckAllowance),
    app.InHandler(HandleShareToTimeline)
  );

  router.put(
    "/favourite",
    app.InHandler(CheckAllowance),
    app.InHandler(HandleAddToFavourites)
  );

  return router;
}

function NetworkRoutes(app: App): Router {
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
  router.get(
    "/search",
    app.InHandler(CheckAllowance),
    app.InHandler(HandleSearches)
  );
  return router;
}

function ExploreRoutes(app: App): Router {
  const router = Router();
  router.get(
    "/explore",
    app.InHandler(CheckAllowance),
    app.InHandler(HandleGetExplore)
  );

  return router;
}

function MiscRoutes(app: App): Router {
  const router = Router();
  router.post(
    "/feedback",
    app.InHandler(CheckAllowance),
    upload.single("image"),
    app.InHandler(HandlePostFeedback)
  );
  router.post(
    "/poll",
    app.InHandler(CheckAllowance),
    app.InHandler(HandlePostPolls)
  );
  router.get(
    "/poll",
    app.InHandler(CheckAllowance),
    app.InHandler(HandleGetPolls)
  );
  router.get(
    "/leaderboard",
    app.InHandler(CheckAllowance),
    app.InHandler(HandleGetLeaderBoard)
  );
  router.post(
    "/search",
    app.InHandler(CheckAllowance),
    app.InHandler(HandleSearches)
  );
  return router;
}

function HandleRoutesFor(app: App) {
  app.srv.use("/notification", NotificationRoutes(app));
  app.srv.use("/profile", ProfileRoutes(app));
  app.srv.use("/auth", AuthRoutes(app));
  app.srv.use("/like", LikeRoutes(app));
  app.srv.use("/comment", CommentRoutes(app));
  app.srv.use("/post", PostRoutes(app));
  app.srv.use("/network", NetworkRoutes(app));
  app.srv.use("/explore", ExploreRoutes(app));
  app.srv.use("/misc", MiscRoutes(app));
}

export default HandleRoutesFor;
