import NotificationManager from "../../internal/notification_manager/notification_manager";
import AuthManager from "../../internal/auth_manager/auth_manager";
import ProfileManager from "../../internal/profile_manager/profile_manager";
import HandleRoutesFor from "./handler";
import { DBInit, RedisInit, ServerInit, SinkInit, TimerInit } from "./init";
import { App } from "./types";
import InMKV from "../../pkg/kv_store/kv_store_";
import Redis from "../../pkg/kv_store/redis";
import { RedisClientType, createClient } from "redis";

async function Init() {
  const srv = ServerInit();
  const db = await DBInit();
  const r = (await RedisInit()) as any;
  const redis = new Redis(r);
  const notificationManager = new NotificationManager(db);
  const authManager = new AuthManager(db, redis);
  const profileManager = new ProfileManager(db);
  const timerManager = TimerInit();
  const app = new App(
    srv,
    authManager,
    notificationManager,
    profileManager,
    redis,
    db
  );
  HandleRoutesFor(app);
  SinkInit(app);
  return app;
}

//Listening
Init()
  .then((app) => {
    app.srv.listen(4000, () => {
      console.log(`Node app running at ${4000}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
