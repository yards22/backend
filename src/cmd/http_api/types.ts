import { PrismaClient } from "@prisma/client";
import { NextFunction, Response, Request } from "express";
import { Express } from "express";
import TodoManager from "../../internal/todo_manager/todo_manager";
import { ToJson } from "../../util/json";

type RouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
  app: App
) => void;

export class App {
  srv: Express;
  todoManager: TodoManager;
  db: PrismaClient;
  constructor(srv: Express, todoManager: TodoManager, db: any) {
    this.srv = srv;
    this.todoManager = todoManager;
    this.db = db;
  }
  InHandler(handler: RouteHandler) {
    return (req: Request, res: Response, next: NextFunction) => {
      return handler(req as any, res, next, this);
    };
  }
  SendRes(
    res: Response,
    resData: {
      status: number;
      data?: any;
      message?: string;
    }
  ) {
    res
      .status(resData.status)
      .send(ToJson({ data: resData.data, is_error: false }));
  }
  ShutDown() {}
}

export default RouteHandler;
