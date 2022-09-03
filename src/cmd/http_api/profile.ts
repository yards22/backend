import { Herror } from "../../pkg/herror/herror";
import { HerrorStatus } from "../../pkg/herror/status_codes";
import RouteHandler from "./types";

export const HandleCreateProfile: RouteHandler = (req, res, next, app) => {
  const userId = BigInt(req.context.userId);
  const userName: string = req.body.username as string;
  const emailId: string = req.body.email_id as string;
  const profileImage: string = req.body.profile_image as string;
  const bio: string = req.body.bio as string;

  if ( userName == undefined || emailId == undefined ) {
    app.SendRes(res, { status: HerrorStatus.StatusUnprocessableEntity, data: "invalid credentials" });
  }
  app.profileManager
    .CreateProfile(userId, userName, bio, profileImage, emailId)
    .then(() => {
      app.SendRes(res, { status: HerrorStatus.StatusOK, data: "profile created successfully" });
    })
    .catch((err) => {
      next(err);
    });
  return;
};

export const HandleCheckIfUsernameExists: RouteHandler = (
  req,
  res,
  next,
  app
) => {
  const username = req.query.username as string;
  if (username === "") {
    return next(new Herror("username missing", HerrorStatus.StatusBadRequest));
  }

  app.profileManager
    .IfUserNameExists(username)
    .then((exists) => {
      app.SendRes(res, { status: HerrorStatus.StatusOK, data: { exists } });
    })
    .catch((err) => {
      next(err);
    });
};

export const HandleGetUserProfile: RouteHandler = (req, res, next, app) => {
  const userId = BigInt(req.context.userId);
  app.profileManager
    .GetUserById(userId)
    .then((profile) => {
      app.SendRes(res, { status: HerrorStatus.StatusOK, data: profile });
    })
    .catch((err) => {
      next(err);
    });
  return;
};

export const HandleUpdateProfile: RouteHandler = (req, res, next, app) => {
  const userId = BigInt(req.context.userId);
  const bio: string = req.body.bio as string;
  app.profileManager
    .UpdateProfile(userId, undefined, bio)
    .then((profile) => {
      // returning the updated profile
      app.SendRes(res, { status: HerrorStatus.StatusOK, data: profile });
    })
    .catch((err) => {
      next(err);
    });
  return;
};
