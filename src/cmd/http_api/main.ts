import NotificationManager from "../../internal/notification_manager/notification_manager";
import AuthManager from "../../internal/auth_manager/auth_manager";
import ProfileManager from "../../internal/profile_manager/profile_manager";
import HandleRoutesFor from "./handler";
import {
  DBInit,
  DynamoInit,
  MailerInit,
  MQ,
  RedisInit,
  RemoteFileStorageInit,
  ServerInit,
  SinkInit,
} from "./init";
import { App } from "./types";
import Redis from "../../pkg/kv_store/redis";
import { ImageResolver } from "../../pkg/image_resolver/image_resolver_";
import { LocalFileStorage } from "../../pkg/file_storage/local_file_storage";
import LikeManager from "../../internal/like_manager/like_manager";
import PostManager from "../../internal/post_manager/post_manager";
import CommentManager from "../../internal/comment_manager/comment_manager";
import NetworkManager from "../../internal/network_manager/network_manager";
import MiscManager from "../../internal/misc_manager/misc_manager";
import ExploreManager from "../../internal/explore_manager/explore_manager";
import Mailer from "../../pkg/mailer/mailer";
import ScoreManager from "../../internal/score_manager/score_manager";

async function Init() {
  const srv = ServerInit();
  const db = await DBInit();
  const mq = await MQ();
  const r = (await RedisInit()) as any;
  const redis = new Redis(r);
  const dynamoDB = await DynamoInit();
  const imageResolver = new ImageResolver({ h: 400, w: 400 }, "jpg");
  const localFileStorage = new LocalFileStorage();
  const remoteFileStorage = RemoteFileStorageInit();
  const mailer = MailerInit();
  // managers
  const notificationManager = new NotificationManager(db);
  const profileManager = new ProfileManager(
    db,
    imageResolver,
    remoteFileStorage,
    redis
    );
    const postManager = new PostManager(
      db,
      imageResolver,
      remoteFileStorage,
      redis
      );
      const likeManager = new LikeManager(db, redis, notificationManager);
      const commentManager = new CommentManager(db, redis, notificationManager);
      const networkManager = new NetworkManager(db, notificationManager);
      const authManager = new AuthManager(db, redis, mailer, networkManager);
      const miscManager = new MiscManager(db, imageResolver, remoteFileStorage);
      const exploreManager = new ExploreManager(
        db,
    imageResolver,
    remoteFileStorage
  );
  const scoreManager = new ScoreManager(mq,dynamoDB)

  const app = new App(
    srv,
    authManager,
    notificationManager,
    profileManager,
    postManager,
    likeManager,
    commentManager,
    networkManager,
    miscManager,
    exploreManager,
    scoreManager,
    redis,
    db,
    imageResolver,
    localFileStorage,
    remoteFileStorage,
    mailer
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
