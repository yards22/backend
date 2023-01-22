import RouteHandler, { App, AppRouter } from "./types";
import { Herror } from "../../pkg/herror/herror";
import { HerrorStatus } from "../../pkg/herror/status_codes";
import { CheckAllowance } from "./middleware";

export function NetworkRoutes(app: App) {
  const appRouter = new AppRouter(app, CheckAllowance);
  appRouter.Get("/", GetRecommendations);
  appRouter.Post("/", HandleNewConnection);
  appRouter.Get("/myfollowers", HandleGetFollowers);
  appRouter.Get("/whoAmIFollowing", HandleGetFollowing);
  appRouter.Delete("/", HandleRemoveConnection);
  appRouter.Get("/search", HandleSearches);
  return appRouter.NativeRouter();
}
const GetRecommendations: RouteHandler = async (req, res, next, app) => {
  const user_id = Number(req.context.user_id);
  const offset = Number(req.body.offset || 0);
  const limit = Number(req.body.limit || 10000);
  try {
    const recommended = await app.networkManager.GetRecommendations(
      user_id,
      offset,
      limit
    );
    app.SendRes(res, {
      status: 200,
      data: recommended,
    });
  } catch (err) {
    next(err);
  }
};

const HandleNewConnection: RouteHandler = async (req, res, next, app) => {
  const user_id = Number(req.context.user_id);
  const following_id = Number(req.body.following_id);
  if (user_id !== undefined && following_id !== undefined) {
    try {
      const { responseStatus } = await app.networkManager.CreateNewConnection(
        user_id,
        following_id
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

const HandleRemoveConnection: RouteHandler = async (req, res, next, app) => {
  const user_id = Number(req.context.user_id);
  const following_id = Number(req.body.following_id);
  if (following_id === undefined)
    return next(new Herror("BadRequest", HerrorStatus.StatusBadRequest));
  try {
    await app.networkManager.UnfollowUser(user_id, following_id);
    app.SendRes(res, {
      status: 200,
      message: "connection_deleted_successfully",
    });
  } catch (err) {
    next(err);
  }
};

const HandleGetFollowers: RouteHandler = async (req, res, next, app) => {
  const user_id = Number(req.context.user_id);
  const username = req.query.username;
  try {
    const followerList = username
      ? await app.networkManager.GetFollowersByUsername(username as string)
      : await app.networkManager.GetFollowers(user_id);
    app.SendRes(res, {
      status: 200,
      data: followerList,
    });
  } catch (err) {
    next(err);
  }
};

const HandleGetFollowing: RouteHandler = async (req, res, next, app) => {
  const user_id = Number(req.context.user_id);
  const username = req.query.username;
  try {
    const followerList = username
      ? await app.networkManager.GetFollowingByUsername(username as string)
      : await app.networkManager.GetFollowing(user_id);
    app.SendRes(res, {
      status: 200,
      data: followerList,
    });
  } catch (err) {
    next(err);
  }
};

const HandleSearches: RouteHandler = async (req, res, next, app) => {
  const search_content = String(req.query.search);
  if (search_content !== "" && search_content !== undefined) {
    const searchResults = await app.networkManager.GetSearchedUsers(
      search_content
    );
    app.SendRes(res, {
      status: 200,
      data: searchResults,
    });
  } else {
    next(new Herror("BadRequest", HerrorStatus.StatusBadRequest));
  }
};
