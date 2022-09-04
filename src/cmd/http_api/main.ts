import NotificationManager from "../../internal/notification_manager/notification_manager";
import { Client } from "pg";
import AuthManager from "../../internal/auth_manager/auth_manager";
import ProfileManager from "../../internal/profile_manager/profile_manager";
import HandleRoutesFor from "./handler";
import { DBInit, ServerInit, SinkInit } from "./init";
import { App } from "./types";

async function Init() {
  const srv = ServerInit();
  const db = await DBInit();
  const notificationManager = new NotificationManager(db);
  const authManager = new AuthManager(db);
  const profileManager = new ProfileManager(db);
  const app = new App(srv, authManager,notificationManager,profileManager, db);
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
