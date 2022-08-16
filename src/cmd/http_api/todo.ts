import { Herror } from "../../pkg/herror/herror";
import { HerrorStatus } from "../../pkg/herror/status_codes";
import RouteHandler from "./types";
const HandleGetTodo: RouteHandler = (req, res, next, app) => {
  const id = Number(req.query.id ?? -1);

  // send all the todos
  if (id == -1) {
    const limit = Number(req.query.limit ?? 10);
    const offset = Number(req.query.offset ?? 0);

    app.todoManager
      .GetManyTodo(limit, offset)
      .then((todo) => {
        app.SendRes(res, { status: 200, data: todo });
      })
      .catch((err) => {
        next(err);
      });

    return;
  }

  app.todoManager
    .GetTodoByID(id)
    .then((todo) => {
      app.SendRes(res, { status: 200, data: todo });
    })
    .catch((err) => {
      next(err);
    });
};

const HandleCreateTodo: RouteHandler = (req, res, next, app) => {
  const title = req.body.title;
  if (!title || title === "") {
    return next(
      new Herror("title missing", HerrorStatus.StatusBadRequest, null)
    );
  }

  app.todoManager
    .CreateTodo(req.body.title, req.body.description)
    .then((todo) => {
      app.SendRes(res, { status: 200, data: todo });
    })
    .catch((err) => {
      next(err);
    });
};

export { HandleGetTodo, HandleCreateTodo };
