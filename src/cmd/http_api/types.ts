import { PrismaClient } from "@prisma/client";
import { NextFunction, Response, Request } from "express";
import { Express } from "express";
import AuthManager from "../../internal/auth_manager/auth_manager";
import { ToJson } from "../../util/json";

type RouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
  app: App
) => void;

export class App {
  srv: Express;
  authManager: AuthManager;
  db: PrismaClient;
  constructor(srv: Express,  authManager: AuthManager,db: any) {
    this.srv = srv;
    this.authManager = authManager;
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
      .send(ToJson({ data: resData.data,message:resData.message, is_error: false }));
  }
  ShutDown() {}
}

export default RouteHandler;
