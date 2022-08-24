import NotificationManager from "../../internal/notification_manager/notification_manager";
import HandleRoutesFor from "./handler";
import { DBInit, ServerInit, SinkInit } from "./init";
import { App } from "./types";

async function Init() {
  const srv = ServerInit();
  const db = await DBInit();
  const todoManager = new NotificationManager(db);
  const app = new App(srv, todoManager, db);
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
