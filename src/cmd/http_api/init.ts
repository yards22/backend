require("dotenv").config();
import express, { Express } from "express";
import { App } from "./types";
import { PrismaClient } from "@prisma/client";
import { HerrorStatus } from "../../pkg/herror/status_codes";
import { Herror } from "../../pkg/herror/herror";
import cors from "cors";
import { RedisClientType } from "@redis/client";
import { createClient } from "redis";
import { S3FileStorage } from "../../pkg/file_storage/s3_file_storage";
import Mailer from "../../pkg/mailer/mailer";
import morgan from "morgan";

// server init
export function ServerInit(): Express {
  const srv = express();
  srv.use((req, res, next) => {
    res.setHeader("X-Powered-By", "Java Spring");
    next();
  });
  srv.enable("trust proxy");
  // const origins = (process.env.REACT_ORIGIN || "http://localhost:3000").split(
  //   ","
  // );
  const options = {
    origin: ['https://stage.d1hobf8elf804j.amplifyapp.com', "http://localhost:3000"]
  };

  console.log(options);
  srv.use(morgan("dev"));
  // const corsOptions = {
  //   origin: function (origin: any, callback: any) {
  //     if (origins.indexOf(origin) !== -1 || !origin) {
  //       callback(null, true);
  //     } else {
  //       callback(new Herror("CORS blocked", HerrorStatus.StatusNotAcceptable));
  //     }
  //   },
  // };
  srv.use(cors(options));

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

// Redis init
export async function RedisInit() {
  try {
    const store = createClient({
      url: process.env.REDIS_URL,
    });
    await store.connect();
    return store;
  } catch (err) {
    throw err;
  }
}

export function MailerInit() {
  const MAIL_HOST = process.env.MAIL_HOST;
  const MAIL_ID = process.env.MAIL_ID;
  const MAIL_PASSWORD = process.env.MAIL_PASSWORD;
  const MAIL_PORT = process.env.MAIL_PORT;

  return new Mailer(
    MAIL_HOST || "",
    Number(MAIL_PORT),
    MAIL_ID || "",
    MAIL_PASSWORD || ""
  );
}

export function RemoteFileStorageInit() {
  return new S3FileStorage(
    (process.env as any).S3_BUCKET,
    (process.env as any).ACCESS_KEY_ID,
    (process.env as any).ACCESS_KEY_SECRET,
    (process.env as any).S3_REGION
  );
}

// Sink init
export function SinkInit(app: App) {
  app.srv.use((req, res, next) => {
    next(new Herror("not found", HerrorStatus.StatusNotFound));
  });

  app.srv.use((err: any, req: any, res: any, next: any) => {
    console.log(err);
    const status = err.status || err.responseStatus.statusCode || 500;
    const message = err.message || err.responseStatus.message || "error";
    res.status(status);
    res.send({
      isError: true,
      status: status,
      message: message,
    });
  });
}
