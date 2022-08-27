import { Router } from "express";
import {HandleSignUp,HandleLogin} from "./auth";
import { App } from "./types";

function AuthRoutes(app:App): Router{
  const router = Router();
  router.post("/signup", app.InHandler(HandleSignUp));
  router.post("/login", app.InHandler(HandleLogin));
  return router;
}

function HandleRoutesFor(app: App) {
  app.srv.use("/auth", AuthRoutes(app));
  
}
export default HandleRoutesFor;
