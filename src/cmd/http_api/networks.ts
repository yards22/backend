import RouteHandler from "./types";
import { Herror } from "../../pkg/herror/herror";
import { HerrorStatus } from "../../pkg/herror/status_codes";

export const GetRecommendations: RouteHandler = async (req, res, next, app) => {
    const user_id = Number(req.context.user_id);
    const offset =Number(req.body.offset);
    const limit = Number(req.body.limit);
    if (user_id !== undefined) {
      const {responseStatus,recommended} = await app.networkManager.GetRecommendations(
        user_id,
        offset,
        limit
      );
      app.SendRes(res,{
        status:responseStatus.statusCode,
        data:recommended,
        message:responseStatus.message
      })
    }
    else{
        next(new Herror("BadRequest", HerrorStatus.StatusBadRequest));  
    }
  
}


export const HandleNewConnection:RouteHandler=async(req,res,next,app)=>{
    const user_id = Number(req.context.user_id);
    const following_id = Number(req.body.following_id);
    console.log(user_id,following_id);
    if(user_id!== undefined && following_id !== undefined){
       try{
            const {responseStatus} = await app.networkManager.CreateNewConnection(
                user_id,
                following_id
            )
            app.SendRes(res,{
                status:responseStatus.statusCode,
                message:responseStatus.message
            })
       }
       catch(err){
          next(err);
       }
    }
    else{
        next(new Herror("BadRequest", HerrorStatus.StatusBadRequest)); 
    }
}

