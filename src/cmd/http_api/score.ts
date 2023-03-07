import { MatchSetupDetails, ScoreItem } from "../../internal/entities/scoreitem";
import { Herror } from "../../pkg/herror/herror";
import { HerrorStatus } from "../../pkg/herror/status_codes";
import { CheckAllowance } from "./middleware";
import RouteHandler, { App, AppRouter } from "./types";

export function ScoreRoutes(app:App){
  const appRouter = new AppRouter(app, CheckAllowance);
  appRouter.Post("/createMatch",HandleStartMatch);
  appRouter.Post("/ballInfo",HandleEachBall);
  return appRouter.NativeRouter();
}

const HandleStartMatch:RouteHandler = async(req,res,next,app)=>{
    const user_id: number = Number(req.context.user_id);
    const primary_info: MatchSetupDetails = (req.body.matchDetails);
    console.log(primary_info )
    primary_info.owner_id = user_id
    try{
      const {responseStatus} = await app.scoreManager.CreateMatch(primary_info);
      app.SendRes(res,{
        status:responseStatus.statusCode,
        message:responseStatus.message
      })
    }
    catch(err){
       next(new Herror("BadRequest", HerrorStatus.StatusBadRequest));
    }
}

const HandleEachBall:RouteHandler = async(req,res,next,app)=>{
    const user_id: number = Number(req.context.user_id);
    const primary_info: ScoreItem = (req.body.matchDetails);
    console.log(primary_info)
    primary_info.owner_id = user_id
    if(primary_info.match_id!==undefined){
        try{
          const {responseStatus} = await app.scoreManager.PushToQueue(primary_info);
          app.SendRes(res,{
            status:responseStatus.statusCode,
            message:responseStatus.message
          })
        }
        catch(err){
           next(new Herror("BadRequest", HerrorStatus.StatusBadRequest));
        }
    }
    else{
      next(new Herror("BadRequest", HerrorStatus.StatusBadRequest));
    }
}