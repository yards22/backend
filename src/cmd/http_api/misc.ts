import { HerrorStatus } from "../../pkg/herror/status_codes";
import { Herror } from "../../pkg/herror/herror";
import RouteHandler  from "./types";

export const HandleRecieveFeedback:RouteHandler = async(req,res,next,app) => {
     const user_id: number = Number(req.context.user_id);
     const content:string = String(req.body.content);
     const username:string = String(req.body.username);
     const images = req.files as Array<any>;
     let image_buffer:Buffer = images[0].buffer;

     try {
         const { responseStatus } =  await app.miscManager.recieveFeedback(
            user_id,
            username,
            image_buffer,
            content
        );
         app.SendRes(res,{
            status: responseStatus.statusCode,
            message: responseStatus.message
         })
     } catch(err) {
         next(new Herror("BadRequest", HerrorStatus.StatusBadRequest));
     }

}