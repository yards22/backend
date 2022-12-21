"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var multer_1 = __importDefault(require("multer"));
var notification_1 = require("./notification");
var auth_1 = require("./auth");
var profile_1 = require("./profile");
var middlewares_1 = require("./middlewares");
var like_1 = require("./like");
var comment_1 = require("./comment");
var post_1 = require("./post");
var misc_1 = require("./misc");
var storage = multer_1.default.memoryStorage();
var upload = (0, multer_1.default)({ storage: storage });
var networks_1 = require("./networks");
function NotificationRoutes(app) {
    var router = (0, express_1.Router)();
    router.get("/", app.InHandler(notification_1.HandleGetNotification));
    router.put("/", app.InHandler(notification_1.HandleUpdateNotificationStatus));
    return router;
}
function AuthRoutes(app) {
    var router = (0, express_1.Router)();
    router.get("/", app.InHandler(middlewares_1.CheckAllowance), app.InHandler(auth_1.HandleMe));
    router.post("/signup", app.InHandler(auth_1.HandleSignUp));
    router.post("/login", app.InHandler(auth_1.HandleLogin));
    router.post("/oauth", app.InHandler(auth_1.HandleGoogleOauth));
    router.post("/sendOTP", app.InHandler(auth_1.HandleOTPGenerationForSignUp));
    router.post("/verifyOTP", app.InHandler(auth_1.HandleOTPVerificationForSignUp));
    router.delete("/logout", app.InHandler(middlewares_1.CheckAllowance), app.InHandler(auth_1.HandleLogout));
    router.post("/sendOTPforgot", app.InHandler(auth_1.HandleOTPGeneration));
    router.post("/verifyOTPforgot", app.InHandler(auth_1.HandleOTPVerification));
    router.post("/updPassword", app.InHandler(auth_1.HandlePasswordUpdate));
    router.post("/logoutAllScreens", app.InHandler(auth_1.HandleLogoutAllScreen));
    return router;
}
function ProfileRoutes(app) {
    var router = (0, express_1.Router)();
    router.put("/", app.InHandler(middlewares_1.CheckAllowance), upload.single("image"), app.InHandler(profile_1.HandleUpdateProfile));
    router.get("/editProfile", app.InHandler(middlewares_1.CheckAllowance), app.InHandler(profile_1.HandleGetUserPrimaryInfo));
    router.get("/", app.InHandler(middlewares_1.CheckAllowance), app.InHandler(profile_1.HandleGetUserProfileInfo));
    return router;
}
function LikeRoutes(app) {
    var router = (0, express_1.Router)();
    router.get("/", app.InHandler(middlewares_1.CheckAllowance), app.InHandler(like_1.HandleGetLikesForPost));
    router.put("/", app.InHandler(middlewares_1.CheckAllowance), app.InHandler(like_1.HandleLikeAndUnlike));
    return router;
}
function CommentRoutes(app) {
    var router = (0, express_1.Router)();
    router.get("/", app.InHandler(middlewares_1.CheckAllowance), app.InHandler(comment_1.HandleGetComments));
    router.post("/", app.InHandler(middlewares_1.CheckAllowance), app.InHandler(comment_1.HandleCreateComment));
    router.delete("/", app.InHandler(middlewares_1.CheckAllowance), app.InHandler(comment_1.HandleDeleteComment));
    router.post("/reply", app.InHandler(middlewares_1.CheckAllowance), app.InHandler(comment_1.HandleCommentReply));
    router.delete("/deleteReply", app.InHandler(middlewares_1.CheckAllowance), app.InHandler(comment_1.HandleDeleteCommentReply));
    return router;
}
function PostRoutes(app) {
    var router = (0, express_1.Router)();
    router.post("/", app.InHandler(middlewares_1.CheckAllowance), upload.array("images"), app.InHandler(post_1.HandleCreatePost));
    router.put("/", app.InHandler(middlewares_1.CheckAllowance), upload.array("images"), app.InHandler(post_1.HandleUpdatePost));
    router.delete("/", app.InHandler(middlewares_1.CheckAllowance), app.InHandler(post_1.HandleDeletePost));
    router.get("/", app.InHandler(middlewares_1.CheckAllowance), app.InHandler(post_1.HandleGetPosts));
    router.post("/shareToTimeline", app.InHandler(middlewares_1.CheckAllowance), app.InHandler(post_1.HandleShareToTimeline));
    router.post("addToFavorites", app.InHandler(middlewares_1.CheckAllowance), app.InHandler(post_1.HandleAddToFavourites));
    return router;
}
function NetworkRoutes(app) {
    var router = (0, express_1.Router)();
    router.get("/", app.InHandler(middlewares_1.CheckAllowance), app.InHandler(networks_1.GetRecommendations));
    router.post("/", app.InHandler(middlewares_1.CheckAllowance), app.InHandler(networks_1.HandleNewConnection));
    router.get("/myfollowers", app.InHandler(middlewares_1.CheckAllowance), app.InHandler(networks_1.HandleGetFollowers));
    router.get("/whoAmIFollowing", app.InHandler(middlewares_1.CheckAllowance), app.InHandler(networks_1.HandleGetFollowing));
    router.delete("/", app.InHandler(middlewares_1.CheckAllowance), app.InHandler(networks_1.HandleRemoveConnection));
    return router;
}
function ExploreRoutes(app) {
    var router = (0, express_1.Router)();
    router.get("/searchUsers", app.InHandler(middlewares_1.CheckAllowance), app.InHandler(networks_1.HandleSearches));
    return router;
}
function MiscRoutes(app) {
    var router = (0, express_1.Router)();
    router.post("/feedback", app.InHandler(middlewares_1.CheckAllowance), app.InHandler(misc_1.HandleRecieveFeedback));
    return router;
}
function HandleRoutesFor(app) {
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
exports.default = HandleRoutesFor;
