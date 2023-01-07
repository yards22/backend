import { Herror } from "../../pkg/herror/herror";
import { HerrorStatus } from "../../pkg/herror/status_codes";
import RouteHandler from "./types";

export const HandleGetNotification: RouteHandler = (req, res, next, app) => {
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

export const HandleUpdateNotificationStatus: RouteHandler = (
  req,
  res,
  next,
  app
) => {
  const forId = Number(req.context.userId);

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
