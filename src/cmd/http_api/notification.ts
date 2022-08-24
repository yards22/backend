import RouteHandler from "./types";
export const HandleGetNotification: RouteHandler = (req, res, next, app) => {
  const forId = BigInt(req.context.userId);
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
      .GetManyByForID(forId, limit, offset, status as any)
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
