import { Herror } from "../../pkg/herror/herror";
import { HerrorStatus } from "../../pkg/herror/status_codes";
import { CheckAllowance } from "./middleware";
import RouteHandler, { App, AppRouter } from "./types";

export function NotificationRoutes(app: App) {
  const appRouter = new AppRouter(app, CheckAllowance);
  appRouter.Get("/", app.InHandler(HandleGetNotification));
  appRouter.Put("/", app.InHandler(HandleUpdateNotificationStatus));
  appRouter.Post("/username", app.InHandler(HandleGetNotificationUsernames));
  return appRouter.NativeRouter();
}

const HandleGetNotification: RouteHandler = (req, res, next, app) => {
  const forId = Number(req.context.user_id);
  const id = req.query.id ? BigInt(Number(req.query.id ?? -1)) : -1;

  // looking for many notifications
  if (id == -1) {
    const limit = Number(req.query.limit ?? 10);
    const offset = Number(req.query.offset ?? 0);
    let status = req.query.status;
    if (!(status == "Unseen" || status == "Read" || status == "Seen")) {
      status = "All";
    }

    app.notificationManager
      .GetManyByForID(forId, status as any, limit, offset)
      .then((notifications) => {
        app.SendRes(res, { status: 200, data: notifications });
      })
      .catch((err) => {
        next(err);
      });

    return;
  }

  // looking for a particular notification with notification id
  app.notificationManager
    .GetByIDAndForID(forId, id)
    .then((notification) => {
      app.SendRes(res, { status: 200, data: notification });
    })
    .catch((err) => {
      next(err);
    });
};

const HandleGetNotificationUsernames: RouteHandler = async (
  req,
  res,
  next,
  app
) => {
  const user_ids = req.body.user_ids;
  try {
    const usernames = await app.notificationManager.UsernameForNotification(
      user_ids
    );
    app.SendRes(res, { status: 200, data: usernames });
  } catch (err) {
    next(err);
  }
};

const HandleUpdateNotificationStatus: RouteHandler = (req, res, next, app) => {
  const forId = Number(req.context.user_id);

  const _ids = req.body.ids as string[];
  const ids = _ids.map((item) => {
    return BigInt(item);
  });

  if (ids.length == 0) {
    next(new Herror("empty_ids", HerrorStatus.StatusBadRequest));
    return;
  }

  let status = req.query.status;
  if (!(status == "Unseen" || status == "Read" || status == "Seen")) {
    next(new Herror("invalid_status", HerrorStatus.StatusBadRequest));
    return;
  }

  app.notificationManager
    .UpdateStatus(forId, ids, status)
    .then((notification) => {
      app.SendRes(res, { status: 200, data: notification });
    })
    .catch((err) => {
      next(err);
    });
};
