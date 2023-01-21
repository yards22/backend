import { PrismaClient } from "@prisma/client";
import { NextFunction, Response, Request, Router } from "express";
import { Express } from "express";
import NotificationManager from "../../internal/notification_manager/notification_manager";
import AuthManager from "../../internal/auth_manager/auth_manager";
import ProfileManager from "../../internal/profile_manager/profile_manager";
import { ToJson } from "../../util/json";
import { IKVStore } from "../../pkg/kv_store/kv_store";
import { ImageResolver } from "../../pkg/image_resolver/image_resolver_";
import { IFileStorage } from "../../pkg/file_storage/file_storage";
import LikeManager from "../../internal/like_manager/like_manager";
import PostManager from "../../internal/post_manager/post_manager";
import CommentManager from "../../internal/comment_manager/comment_manager";
import NetworkManager from "../../internal/network_manager/network_manager";
import MiscManager from "../../internal/misc_manager/misc_manager";
import ExploreManager from "../../internal/explore_manager/explore_manager";
import Mailer from "../../pkg/mailer/mailer";
interface CustomRequest extends Request {
  context: any;
}

type RouteHandler = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
  app: App
) => void;

export class AppRouter {
  private router: Router;
  app: App;
  authFn?: RouteHandler;
  constructor(app: App, authFn?: RouteHandler) {
    this.router = Router();
    this.app = app;
    this.authFn = authFn;
  }
  NativeRouter() {
    return this.router;
  }
  Get(
    path: string,
    handler: RouteHandler,
    withAuth: boolean = true,
    specificFn?: RouteHandler
  ) {
    this.router.get(path, this.prepare(handler, withAuth, specificFn));
  }
  Post(
    path: string,
    handler: RouteHandler,
    withAuth: boolean = true,
    specificFn?: RouteHandler
  ) {
    this.router.get(path, this.prepare(handler, withAuth, specificFn));
  }
  Put(
    path: string,
    handler: RouteHandler,
    withAuth: boolean = true,
    specificFn?: RouteHandler
  ) {
    this.router.get(path, this.prepare(handler, withAuth, specificFn));
  }
  Delete(
    path: string,
    handler: RouteHandler,
    withAuth: boolean = true,
    specificFn?: RouteHandler
  ) {
    this.router.get(path, this.prepare(handler, withAuth, specificFn));
  }
  Patch(
    path: string,
    handler: RouteHandler,
    withAuth: boolean = true,
    specificFn?: RouteHandler
  ) {
    this.router.get(path, this.prepare(handler, withAuth, specificFn));
  }
  private prepare(
    handler: RouteHandler,
    withAuth: boolean = true,
    specificFn?: RouteHandler
  ) {
    const fns: ((req: Request, res: Response, next: NextFunction) => void)[] =
      [];

    const doAuthWith = specificFn || this.authFn;
    if (withAuth && doAuthWith) fns.push(this.app.InHandler(doAuthWith));
    fns.push(this.app.InHandler(handler));
    return fns;
  }
}

export class App {
  srv: Express;
  authManager: AuthManager;
  notificationManager: NotificationManager;
  profileManager: ProfileManager;
  postManager: PostManager;
  likeManager: LikeManager;
  commentManager: CommentManager;
  networkManager: NetworkManager;
  miscManager: MiscManager;
  exploreManager: ExploreManager;
  db: PrismaClient;
  kvStore: IKVStore;
  imageResolver: ImageResolver;
  localFileStorage: IFileStorage;
  remoteFileStorage: IFileStorage;
  mailer: Mailer;
  constructor(
    srv: Express,
    authManager: AuthManager,
    notificationManager: NotificationManager,
    profileManager: ProfileManager,
    postManager: PostManager,
    likeManager: LikeManager,
    commentManager: CommentManager,
    networkManager: NetworkManager,
    miscManager: MiscManager,
    exploreManager: ExploreManager,
    kvStore: IKVStore,
    db: any,
    imageResolver: ImageResolver,
    localFileStore: IFileStorage,
    remoteFileStorage: IFileStorage,
    mailer: Mailer
  ) {
    this.srv = srv;
    this.notificationManager = notificationManager;
    this.authManager = authManager;
    this.profileManager = profileManager;
    this.postManager = postManager;
    this.likeManager = likeManager;
    this.commentManager = commentManager;
    this.networkManager = networkManager;
    this.miscManager = miscManager;
    this.exploreManager = exploreManager;
    this.db = db;
    this.kvStore = kvStore;
    this.imageResolver = imageResolver;
    this.localFileStorage = localFileStore;
    this.remoteFileStorage = remoteFileStorage;
    this.mailer = mailer;
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
    res.setHeader("Content-Type", "application/json");
    res.status(resData.status).send(
      ToJson({
        data: resData.data,
        message: resData.message,
        is_error: false,
      })
    );
  }
  ShutDown() {}
}

export default RouteHandler;
