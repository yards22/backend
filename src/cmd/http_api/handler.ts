import { Router } from "express";
import {
  HandleGetNotification,
  HandleUpdateNotificationStatus,
} from "./notification";
import { HandleCreateProfile, HandleGetUserDetails, HandleUpdateProfile } from "./profile";
import RouteHandler, { App } from "./types";

function NotificationRoutes(app: App): Router {
  const router = Router();
  router.get("/", app.InHandler(HandleGetNotification));
  router.put("/", app.InHandler(HandleUpdateNotificationStatus));
  return router;
}
function ProfileRoutes(app: App): Router {
  const router = Router();
  router.get("/",app.InHandler(HandleGetUserDetails));
  router.post("/",app.InHandler(HandleCreateProfile));
  router.put("/",app.InHandler(HandleUpdateProfile));
  return router;
}
function HandleRoutesFor(app: App) {
  app.srv.use("/notification", NotificationRoutes(app));
  app.srv.use("/profile",ProfileRoutes(app));
}
export default HandleRoutesFor;
