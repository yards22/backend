import { Herror } from "../../pkg/herror/herror";
import { HerrorStatus } from "../../pkg/herror/status_codes";
import RouteHandler from "./types";

//TODO: should change from req.body to req.context for user_id.

export const HandleUpdateProfile: RouteHandler = (req, res, next, app) => {

  const user_id: number = Number(req.context.user_id);
  const bio: string = req.body.bio as string;
  const profile_buffer: any = req.file?.buffer;
  const updated_at: Date = new Date();
  const username:string = req.body.username;
  
  if(username != undefined && user_id !=undefined){
    app.profileManager
    .UpdateProfileDetails(user_id, username, updated_at,profile_buffer,bio)
    .then((profile) => {
      app.SendRes(res, { 
        status: 200,
        data: profile 
      });
    })
    .catch((err) => {
      next(err);
    });
  }
  else{
    next(new Herror("BadRequest", HerrorStatus.StatusBadRequest));
  }
  
};

export const HandleGetUserPrimaryInfo: RouteHandler = (req, res, next, app) => {
  const user_id = Number(req.context.user_id);
  if(user_id != undefined){
    app.profileManager
    .GetUserPrimaryInfoById(user_id)
    .then((profile) => {
      app.SendRes(res, { status: 200, data: profile });
    })
    .catch((err) => {
      next(err);
    });
  }
  else{
    next(new Herror("BadRequest", HerrorStatus.StatusBadRequest));
  }
};

export const HandleGetUserProfileInfo:RouteHandler = (req, res, next, app)=>{
  const user_id = Number(req.context.user_id);
  if(user_id != undefined){
    app.profileManager
    .GetUserProfileById(user_id)
    .then((profile) => {
      app.SendRes(res, { status: 200, data: profile });
    })
    .catch((err) => {
      next(err);
    });
  }
  else{
    next(new Herror("BadRequest", HerrorStatus.StatusBadRequest));
  }
}
