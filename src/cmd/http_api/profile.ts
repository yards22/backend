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
  const bio: string = req.body.bio;
  const name: string = req.body.name;
  let profile_buffer: Buffer | undefined = undefined;
  if (req.file && req.file.buffer) profile_buffer = req.file.buffer;

  const username: string = req.body.username;
  if (validateUsername(username) !== null) {
    return next(new Herror("invalid username", HerrorStatus.StatusBadRequest));
  }

  const interests: string = req.body.interests;
  const { responseStatus, profileData } =
    await app.profileManager.UpdateProfileDetails(
      user_id,
      token,
      profile_buffer,
      bio,
      name,
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
  const limit = Number(req.query.limit || 1000);
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
  const ve = validateUsername(username);
  if (ve) return next(new Herror(ve.message, HerrorStatus.StatusConflict));
  try {
    const { responseStatus } = await app.profileManager.CheckUsername(username);
    app.SendRes(res, {
      status: responseStatus.statusCode,
      message: responseStatus.message,
    });
  } catch (err) {
    next(err);
  }
};

export function validateUsername(username: string) {
  console.log(username)
  if (username.length < 6 || username.length > 18)
    return new Error("Username length should be between 6 and 18.");

  if (username.includes(" "))
    return new Error("Username cannot contain spaces.");

  if (!isAlpha(username[0]))
    return new Error(
      "Username cannot start with a number, special character or spaces."
    );

  return null;
}

var isAlpha = function (ch: string) {
  return typeof ch === "string" && ch.length === 1 && /[A-Za-z]/.test(ch);
};
