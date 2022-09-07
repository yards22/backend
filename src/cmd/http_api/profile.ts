import { Herror } from "../../pkg/herror/herror";
import { HerrorStatus } from "../../pkg/herror/status_codes";
import RouteHandler from "./types";

export const HandleCreateProfile: RouteHandler = (req, res, next, app) => {
  const userId = Number(req.context.userId);

  const userName: string = req.body.username;
  const emailId: string = req.body.email_id;
  const profileImage: string = req.body.profile_image;
  const registeredDate: Date = new Date();
  const bio: string = req.body.bio;
  const cricIndex = req.body.cric_index;
  if (userName == undefined || emailId == undefined) {
    app.SendRes(res, { status: 422, data: "invalid credentials" });
  }
  app.profileManager
    .CreateProfile(userId, userName, bio, profileImage, emailId)
    .then(() => {
      app.SendRes(res, { status: 200, data: "profile created successfully" });
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
  const userId = Number(req.context.userId);
  app.profileManager
    .GetUserById(userId)
    .then((profile) => {
      app.SendRes(res, { status: 200, data: profile });
    })
    .catch((err) => {
      next(err);
    });
  return;
};

export const HandleUpdateProfile: RouteHandler = (req, res, next, app) => {
  const userId = Number(req.context.userId);
  const bio: string = req.body.bio as string;
  app.profileManager
    .UpdateProfile(userId, undefined, bio)
    .then((profile) => {
      // returning the updated profile
      app.SendRes(res, { status: 200, data: profile });
    })
    .catch((err) => {
      next(err);
    });
  return;
};

export const HandleUpdateProfileImage: RouteHandler = (req, res, next, app) => {
  const userId = Number(req.context.userId);
  const bio: string = req.body.bio as string;
  app.profileManager
    .UpdateProfile(userId, undefined, bio)
    .then((profile) => {
      // returning the updated profile
      app.SendRes(res, { status: 200, data: profile });
    })
    .catch((err) => {
      next(err);
    });
  return;
};
