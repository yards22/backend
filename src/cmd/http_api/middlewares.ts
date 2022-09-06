import { Herror } from "../../pkg/herror/herror";
import { HerrorStatus } from "../../pkg/herror/status_codes";
import RouteHandler from "./types";

export const CheckAllowance: RouteHandler = async (req, res, next, app) => {
  const accessToken = req.headers.authorization?.replace("Bearer ", "");
  if (accessToken == "" || accessToken == undefined) {
    return next(new Herror("unauthorized", HerrorStatus.StatusUnauthorized));
  }
  const userDataStr = app.kvStore.Get(accessToken);
  
  // convert user_id back to bigint.

  if (!userDataStr)
    return next(new Herror("unauthorized", HerrorStatus.StatusUnauthorized));

  // the user is authorized
  req.context.userData = JSON.parse((userDataStr || "") as any);
};
