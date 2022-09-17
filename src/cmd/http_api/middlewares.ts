import { Herror } from "../../pkg/herror/herror";
import { HerrorStatus } from "../../pkg/herror/status_codes";
import RouteHandler from "./types";
import multer from "multer";

export const CheckAllowance: RouteHandler = async (req, res, next, app) => {
  const accessToken = req.headers.authorization?.replace("Bearer ", "");
  if (accessToken == "" || accessToken == undefined) {
    return next(new Herror("unauthorized", HerrorStatus.StatusUnauthorized));
  }
  try {
    const userDataStr = await app.kvStore.Get("token_" + accessToken);

    // convert user_id back to bigint.

    if (!userDataStr)
      return next(new Herror("unauthorized", HerrorStatus.StatusUnauthorized));

    // the user is authorized
    req.context = JSON.parse((userDataStr || "") as any);
    req.context.token = accessToken;
    next();
  } catch (err) {
    next(err);
  }
};
