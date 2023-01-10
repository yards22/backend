import { off } from "process";
import { Herror } from "../../pkg/herror/herror";
import { HerrorStatus } from "../../pkg/herror/status_codes";
import RouteHandler from "./types";

export const HandleGetStories:RouteHandler=async (req,res,next,app)=>{
    const user_id:number = Number(req.context.user_id);
    const limit = Number(req.body.limit);
    const offset = Number(req.body.offset);
    if(user_id!=undefined){
        const stories = await app.exploreManager.GetStories(limit,offset);
        app.SendRes(res,{
            status:HerrorStatus.StatusOK,
            data: stories
        });
    }
    else{
        next(new Herror("BadRequest", HerrorStatus.StatusBadRequest));
    }
}


export const HandleGetRecommendedUsers:RouteHandler=async (req,res,next,app)=>{
    const user_id:number = Number(req.context.user_id);
    const limit = Number(req.body.limit);
    const offset = Number(req.body.offset);
    if(user_id !== undefined){
        const stories =  await app.exploreManager.GetRecommendedUsers(limit,offset,user_id);
        app.SendRes(res,{
            status:HerrorStatus.StatusOK,
            data: stories
        });
    }
    else{
        next(new Herror("BadRequest", HerrorStatus.StatusBadRequest));
    }
}

// add handleGetExplore Controller.
export const HandleGetExplore:RouteHandler=async (req,res,next,app)=>{
    const user_id:number = Number(req.context.user_id);
    if(user_id !== undefined){
        const data = await app.exploreManager.GetExplore(user_id);
        app.SendRes(res,{
            status:HerrorStatus.StatusOK,
            data
        });
    }
    else{
        
        next(new Herror("BadRequest", HerrorStatus.StatusBadRequest));
    }
}


export const HandlePostStories:RouteHandler = async(req,res,next,app)=>{
    const user_id:number = Number(req.context.user_id);
    const content:string = req.body.content;
    const images = req.files as Array<any>;
    let image_buffer: Buffer[] = [];
    for (let i = 0; i < images?.length; i++) {
      image_buffer.push(images[i].buffer);
    }  

    if(user_id !== undefined){
        await app.exploreManager.CreateStories(user_id, content, image_buffer);
        app.SendRes(res,{
            status:HerrorStatus.StatusOK,
        });
    }
    else{
        next(new Herror("BadRequest", HerrorStatus.StatusBadRequest));
    }
}

