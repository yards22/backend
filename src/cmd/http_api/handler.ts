import { Router } from "express";
import { HandleCreateTodo, HandleGetTodo } from "./todo";
import { App } from "./types";

function TodoRoutes(app: App): Router {
  const router = Router();
  router.get("/", app.InHandler(HandleGetTodo));
  router.post("/", app.InHandler(HandleCreateTodo));
  return router;
}

function HandleRoutesFor(app: App) {
  app.srv.use("/", TodoRoutes(app));
}
export default HandleRoutesFor;
