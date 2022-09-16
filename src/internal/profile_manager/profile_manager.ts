import { PrismaClient } from "@prisma/client";
import { resolve } from "path";
import { S3FileStorage } from "../../pkg/file_storage/s3_file_storage";
import { Herror } from "../../pkg/herror/herror";
import { HerrorStatus } from "../../pkg/herror/status_codes";
import { ImageResolver } from "../../pkg/image_resolver/image_resolver_";
import { RandomString } from "../../util/random";
import EProfile from "../entities/profile";

interface IResponse {
  statusCode: number;
  message?: string;
}


export default class ProfileManager {
  private store: PrismaClient;
  constructor(store: PrismaClient) {
    this.store = store;
  }

  GetUserByUsername(username:string):Promise<EProfile | null>{
    return this.store.profile.findUnique({
      where:{
        username
      }
    })
  }

  GetUserPrimaryInfoById(user_id: number): Promise<EProfile | null> {
    return this.store.profile.findUnique({
      where: {
        user_id: user_id,
      },
      include: {
        user: {
          include: { Interests: true },
        },
      },
    });
  }

  GetUserProfileById(user_id: number):Promise<EProfile | null> {
    return this.store.profile.findUnique({
      where: {
        user_id: user_id,
      },
      include: {
        user: {
          include: { 
            Interests: true,
            //TODO: to be added.
            // Posts: true,
            // Bookmarked :true.
          },
        },
      },
    });
  }

  UpdateProfile(
    user_id: number,
    username:string,
    updated_at: Date,
    profile_image_uri?: string,
    bio?: string
  ): Promise<EProfile> {
    return this.store.profile.update({
      where: {
        user_id: user_id,
      },
      data: {
        username:username,
        profile_image_uri: profile_image_uri,
        bio: bio,
        updated_at:updated_at
      },
    });
  }
  
  UpdateProfileDetails(
    user_id: number,
    username:string,
    updated_at: Date,
    profile_image_buffer:any,
    bio?: string
  ):Promise<{
    responseStatus: IResponse;
    profileData?: EProfile
  }> {
    return new Promise(async (resolve,reject)=>{
      try{
        const fileStorage = new S3FileStorage(
          (process.env as any).S3_BUCKET,
          (process.env as any).ACCESS_KEY_ID,
          (process.env as any).ACCESS_KEY_SECRET,
          (process.env as any).S3_REGION
       );
       const filePath = username+"_dp.webp";
       const BucketUrl = "https://22yards-image-bucket.s3.ap-south-1.amazonaws.com/";
       const ObjUrl = BucketUrl+filePath;
       const imageResolver = new ImageResolver({ h: 320, w: 500 }, "jpeg");
       const image = await imageResolver.Convert(profile_image_buffer);
       await fileStorage.Put(filePath,image);
       const UpdatedProfile = await this.UpdateProfile(user_id,username,updated_at,ObjUrl,bio)
       resolve({
        responseStatus: {
          statusCode: HerrorStatus.StatusOK,
          message: "successful_Updation",
        },
        profileData: UpdatedProfile
       });
      }
      catch(err){
         reject(err);
      }
    })
  }

  CheckUsername(username:string): Promise<{
    responseStatus: IResponse;
    userData?: EProfile;
  }> {
    return new Promise(async (resolve,reject)=>{
       try{
         const user = await this.GetUserByUsername(username);
         if(user === undefined || user === null){
            resolve({
              responseStatus:{
                statusCode: HerrorStatus.StatusOK,
                message: "username_exists",
              }
            })
         }
         else{
          resolve({
            responseStatus: {
              statusCode: HerrorStatus.StatusUnauthorized,
              message: "username_already_taken",
            }
          });
         }
       }
       catch(err){
         reject(err);
       }
    })
  }


}


