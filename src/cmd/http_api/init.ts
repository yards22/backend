import express, { Express } from "express";
import { App } from "./types";
import { PrismaClient } from "@prisma/client";
import { HerrorStatus } from "../../pkg/herror/status_codes";
import { Herror } from "../../pkg/herror/herror";
import config from "config";
import cors from "cors";

// server init
export function ServerInit(): Express {
  const srv = express();
  srv.use((req, res, next) => {
    res.setHeader("X-Powered-By", "Java Spring");
    next();
  });
  srv.enable("trust proxy");
  srv.use(
    cors({
      origin: config.get("origin"),
      credentials: true,
    })
  );
  srv.use(express.json());
  srv.use(express.urlencoded({ extended: true }));
  return srv;
}

// DB init
export async function DBInit(): Promise<PrismaClient> {
  // TODO: take from config store
  const client = new PrismaClient();
  let i = 0;
  try {
    await client.$connect();
    console.log("connected to db...");
    return client;
  } catch (err) {
    throw err;
  }
}

// Sink init
export function SinkInit(app: App) {
  app.srv.use((req, res, next) => {
    next(new Herror("not found", HerrorStatus.StatusNotFound));
  });

  app.srv.use((err: any, req: any, res: any, next: any) => {
    res.status(err.status || 500);
    res.send({
      isError: true,
      status: err.status,
      message: err.message,
    });
  });
}
