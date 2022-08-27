import { Router } from "express";
import {
  HandleGetNotification,
  HandleUpdateNotificationStatus,
} from "./notification";
import {HandleSignUp,HandleLogin} from "./auth";
import { App } from "./types";

function NotificationRoutes(app: App): Router {
  const router = Router();
  router.get("/", app.InHandler(HandleGetNotification));
  router.put("/", app.InHandler(HandleUpdateNotificationStatus));
  return router;
}

function AuthRoutes(app:App): Router{
  const router = Router();
  router.post("/signup", app.InHandler(HandleSignUp));
  router.post("/login", app.InHandler(HandleLogin));
  return router;
}

function HandleRoutesFor(app: App) {
  app.srv.use("/notification", NotificationRoutes(app));
  app.srv.use("/auth", AuthRoutes(app));
}
export default HandleRoutesFor;
