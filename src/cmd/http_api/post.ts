import { Herror } from "../../pkg/herror/herror";
import { HerrorStatus } from "../../pkg/herror/status_codes";
import RouteHandler from "./types";


//TODO: Perform proper error handling.

export const HandleCreatePost:RouteHandler=async(req,res,next,app)=>{
    const user_id : number= Number(req.context.user_id);
    const content : string = String(req.body.content);
    const images = req.files as Array<any>;
    let image_buffer:Buffer[] = [];
    for(let i=0;i<images?.length;i++){
        image_buffer.push(images[i].buffer);
    }

    try{
      await app.postManager.Create(user_id,content,image_buffer);
      app.SendRes(res,{
        status:200,
      });
    }
    catch(err){
       next(err);
    }
}

export const HandleUpdatePost:RouteHandler = async(req,res,next,app)=>{
      const user_id:number = Number(req.context.user_id);
      const content : string = String(req.body.content);
      const post_id:bigint = BigInt(req.body.post_id);

      try{
        const updated_post = await app.postManager.Update(user_id,post_id,content);
        app.SendRes(res,{
            status:200,
            data:updated_post
        });
      }
      catch(err){
        next(err);
      }
}

export const HandleDeletePost:RouteHandler = async(req,res,next,app)=>{
    const user_id : number = Number(req.context.user_id);
    const post_id : bigint = BigInt(req.body.post_id);
    
    try{
       await app.postManager.Delete(user_id,post_id);
       app.SendRes(res,{
        status:200,
        message:"post_deleted"
       })
    }
    catch(err){
        next(err);
    }
}

export const HandleShareToTimeline:RouteHandler = async(req,res,next,app)=>{
    const user_id : number = Number(req.context.user_id);
    const post_id : bigint = BigInt(req.body.post_id);
    const content : string = String(req.body.content);
    try{
      await app.postManager.ShareToTimeline(user_id,post_id,content);
      app.SendRes(res,{
        status:200
      })
    }
    catch(err){
        next(err);
    }
}

export const HandleAddToFavourites:RouteHandler = async(req,res,next,app)=>{
    const user_id :number= Number(req.context.user_id);
    const post_id :bigint = BigInt(req.body.post_id);
   
    if(post_id===undefined || post_id===null){
        next(new Herror("post_id missing", HerrorStatus.StatusBadRequest));
    }
    else{
       try{
         const data = await  app.postManager.BookmarkPosts(user_id,post_id);
         app.SendRes(res,{
          status:200,
          data
         });
       }
       catch(err){
          next(err);
       }
    }

}
