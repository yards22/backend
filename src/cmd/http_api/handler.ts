import { App } from "./types";
import { AuthRoutes } from "./auth";
import { CommentRoutes } from "./comment";
import { ExploreRoutes } from "./explore";
import { LikeRoutes } from "./like";
import { MiscRoutes } from "./misc";
import { ProfileRoutes } from "./profile";
import { PostRoutes } from "./post";
import { NotificationRoutes } from "./notification";
import { NetworkRoutes } from "./networks";
import { HealthRoutes } from "./health";

function HandleRoutesFor(app: App) {
  app.srv.use("/health", HealthRoutes(app));
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
