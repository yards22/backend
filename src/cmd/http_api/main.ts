import NotificationManager from "../../internal/notification_manager/notification_manager";
import AuthManager from "../../internal/auth_manager/auth_manager";
import ProfileManager from "../../internal/profile_manager/profile_manager";
import HandleRoutesFor from "./handler";
import {
  DBInit,
  RedisInit,
  RemoteFileStorageInit,
  ServerInit,
  SinkInit,
  TimerInit,
} from "./init";
import { App } from "./types";
import Redis from "../../pkg/kv_store/redis";
import { ImageResolver } from "../../pkg/image_resolver/image_resolver_";
import { LocalFileStorage } from "../../pkg/file_storage/local_file_storage";

async function Init() {
  const srv = ServerInit();
  const db = await DBInit();
  const r = (await RedisInit()) as any;
  const redis = new Redis(r);
  const imageResolver = new ImageResolver({ h: 400, w: 400 }, "jpg");
  const localFileStorage = new LocalFileStorage();
  const remoteFileStorage = RemoteFileStorageInit();
  // managers
  const notificationManager = new NotificationManager(db);
  const authManager = new AuthManager(db, redis);
  const profileManager = new ProfileManager(
    db,
    imageResolver,
    remoteFileStorage
  );

  const app = new App(
    srv,
    authManager,
    notificationManager,
    profileManager,
    redis,
    db,
    imageResolver,
    localFileStorage,
    remoteFileStorage
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
