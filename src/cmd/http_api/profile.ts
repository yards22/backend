import { Herror } from "../../pkg/herror/herror";
import { HerrorStatus } from "../../pkg/herror/status_codes";
import { CheckAllowance } from "./middleware";
import RouteHandler, { App, AppRouter } from "./types";

export function ProfileRoutes(app: App) {
  const appRouter = new AppRouter(app, CheckAllowance);
  appRouter.Put("/", HandleUpdateProfile, true, {
    multiple: false,
    fieldName: "image",
  });
  appRouter.Get("/", HandleGetUserProfileInfo);
  appRouter.Get("/username/check-availability", HandleCheckUsername);
  return appRouter.NativeRouter();
}

const HandleUpdateProfile: RouteHandler = async (req, res, next, app) => {
  const user_id: number = Number(req.context.user_id);
  const token: string = req.context.token;
  const bio: string = req.body.bio as string;
  let profile_buffer: Buffer | undefined = undefined;
  if (req.file && req.file.buffer) profile_buffer = req.file.buffer;

  const username: string = req.body.username;
  if (!validateUsername(username)) {
    return next(new Herror("invalid username", HerrorStatus.StatusBadRequest));
  }

  const interests: string = req.body.interests;
  const { responseStatus, profileData } =
    await app.profileManager.UpdateProfileDetails(
      user_id,
      token,
      profile_buffer,
      bio,
      username,
      interests
    );
  app.SendRes(res, {
    status: responseStatus.statusCode,
    data: profileData,
    message: responseStatus.message,
  });
};

const HandleGetUserProfileInfo: RouteHandler = async (req, res, next, app) => {
  var username: string;
  username = req.query.username as string;
  const user_id = Number(req.context.user_id);
  const limit = Number(req.query.limit || 10);
  const offset = Number(req.query.offset || 0);
  if (user_id != undefined) {
    if (username === undefined) {
      const userProfile = await app.profileManager.GetUserProfileById(
        user_id,
        offset,
        limit
      );
      app.SendRes(res, {
        status: HerrorStatus.StatusOK,
        data: userProfile,
      });
    } else {
      const userProfile = await app.profileManager.GetUserByUsernameBulk(
        username,
        offset,
        limit
      );
      app.SendRes(res, {
        status: HerrorStatus.StatusOK,
        data: userProfile,
      });
    }
  } else {
    next(new Herror("BadRequest", HerrorStatus.StatusBadRequest));
  }
};

const HandleCheckUsername: RouteHandler = async (req, res, next, app) => {
  const username = req.query.username as string;
  if (validateUsername(username)) {
    try {
      const { responseStatus } = await app.profileManager.CheckUsername(
        username
      );
      app.SendRes(res, {
        status: responseStatus.statusCode,
        message: responseStatus.message,
      });
    } catch (err) {
      next(err);
    }
  } else {
    next(new Herror("BadRequest", HerrorStatus.StatusBadRequest));
  }
};

function validateUsername(username: string | undefined | null): boolean {
  if (!username) return false;
  return new RegExp("^[A-Za-z][A-Za-z0-9_]{7,29}$").test(username);
}
