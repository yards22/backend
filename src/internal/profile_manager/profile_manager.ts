import { PrismaClient } from "@prisma/client";
import { resolve } from "path";
import { S3FileStorage } from "../../pkg/file_storage/s3_file_storage";
import { RandomString } from "../../util/random";
import EProfile from "../entities/profile";

export default class ProfileManager {
  private store: PrismaClient;
  constructor(store: PrismaClient) {
    this.store = store;
  }

  async IfUserNameExists(username: string): Promise<boolean> {
    const profile = await this.store.profile.findFirst({
      where: {
        username,
      },
    });
    if (profile !== null && profile.username === username) {
      // username already exists
      return true;
    }
    return false;
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

  // accepting profileImageUri or bio as optional so as any one can also be updated at once
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

  // TODO: Handle image upload and then take profile image uri
  CreateProfile(
    userId: number,
    userName: string,
    emailId: string,
    bio?: string,
    profileImageUri?: string,
  ): Promise<EProfile> {
    return this.store.profile.create({
      data: {
        user_id: userId,
        username: userName,
        email_id: emailId,
        profile_image_uri: profileImageUri,
        bio: bio,
      },
    });
  }
  
  UpdateProfileDetails(
    user_id: number,
    username:string,
    updated_at: Date,
    profile_image_buffer:any,
    bio?: string
  ) :Promise<EProfile>{
    return new Promise(async (resolve,reject)=>{
       // upload image to s3
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
       await fileStorage.Put(filePath,profile_image_buffer);
       const UpdatedProfile = await this.UpdateProfile(user_id,username,updated_at,ObjUrl,bio)
         resolve(UpdatedProfile);
      }
      catch(err){
         reject(err);
      }
    })
  }


}


