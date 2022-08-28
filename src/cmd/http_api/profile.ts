import { bindComplete } from "pg-protocol/dist/messages";
import { Herror } from "../../pkg/herror/herror";
import { HerrorStatus } from "../../pkg/herror/status_codes";
import RouteHandler from "./types";

export const HandleCreateProfile: RouteHandler = (req,res,next,app) => {
    const userId: bigint = BigInt(req.body.id as string);
    const userName: string = req.body.username;
    const emailId: string = req.body.email_id;
    const profileImage: string = req.body.profile_image; 
    const registeredDate: Date = new Date();
    const bio: string = req.body.bio;
    const cricIndex = req.body.cric_index;
    if ( userName == undefined || emailId == undefined ) {
         app.SendRes(res,{status: 422,data:'invalid credentials'});
    }
    app.profileManager
       .CreateProfile(
        userId,
        userName,
        emailId,
        profileImage,
        registeredDate,
        bio,
        cricIndex
       )
       .then(() => {
         app.SendRes(res,{status: 200,data: 'profile created successfully'});
       }).catch((err) => {
         next(err);
       })
       return;
}
export const HandleGetUserDetails: RouteHandler = (req,res,next,app) => {
    const userId:bigint= BigInt(req.query.id as string) ;
    // Assert: Assuming req.query.id is not undefined for every http request to the profile
    app.profileManager
      .GetUserById(userId)
      .then((user) => {
        app.SendRes(res,{status: 200,data: user})
    }).catch(err => {
        next(err);
    });
    return;
}

export  const HandleUpdateProfile: RouteHandler = (req,res,next,app) => {
    const userId: bigint = BigInt(req.body.id as string);
    // Assert: req.body.id is not undefined
    const profileImage:string = req.body.profile_image as string;
    const bio: string = req.body.bio as string;
    app.profileManager
       .UpdateProfile(userId,profileImage,bio)
       .then(() => {
        app.SendRes(res,{status: 200,data: "profile updated successfully"})
       }).catch(err => {
         next(err);
       });
       return;
}