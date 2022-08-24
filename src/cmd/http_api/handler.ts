import { Router } from "express";
import { HandleGetNotification } from "./notification";
import { App } from "./types";

function NotificationRoutes(app: App): Router {
  const router = Router();
  router.get("/", app.InHandler(HandleGetNotification));
  return router;
}

function HandleRoutesFor(app: App) {
  app.srv.use("/", NotificationRoutes(app));
}
export default HandleRoutesFor;
