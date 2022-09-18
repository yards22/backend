import { PrismaClient } from "@prisma/client";
import { IFileStorage } from "../../pkg/file_storage/file_storage";
import { HerrorStatus } from "../../pkg/herror/status_codes";
import { ImageResolver } from "../../pkg/image_resolver/image_resolver_";
import EProfile from "../entities/profile";

interface IResponse {
  statusCode: number;
  message?: string;
}

export default class ProfileManager {
  private store: PrismaClient;
  private imageStorage: IFileStorage;
  private imageResolver: ImageResolver;
  constructor(
    store: PrismaClient,
    imageResolver: ImageResolver,
    imageStorage: IFileStorage
  ) {
    this.store = store;
    this.imageStorage = imageStorage;
    this.imageResolver = imageResolver;
  }

  GetUserByUsername(username: string): Promise<EProfile | null> {
    return this.store.profile.findUnique({
      where: {
        username,
      },
    });
  }

  GetUserPrimaryInfoById(user_id: number): Promise<EProfile | null> {
    return this.store.profile.findUnique({
      where: {
        user_id: user_id,
      },
    });
  }

  GetUserProfileById(user_id: number): Promise<EProfile | null> {
    return this.store.profile.findUnique({
      where: {
        user_id: user_id,
      },
    });
  }

  UpdateProfile(
    user_id: number,
    username: string,
    updated_at: Date,
    profile_image_uri?: string,
    bio?: string,
    interests?: string
  ): Promise<EProfile> {
    return this.store.profile.update({
      where: {
        user_id: user_id,
      },
      data: {
        username: username,
        profile_image_uri: profile_image_uri,
        bio: bio,
        updated_at: updated_at,
        interests,
      },
    });
  }

  UpdateProfileDetails(
    user_id: number,
    username: string,
    updated_at: Date,
    rawImage: Buffer,
    bio?: string,
    interests?: string
  ): Promise<{
    responseStatus: IResponse;
    profileData?: EProfile;
  }> {
    return new Promise(async (resolve, reject) => {
      try {
        const format = "jpg";
        const filePath = username + "_dp." + format;
        let resolvedImage = await this.imageResolver.Convert(
          rawImage,
          { h: 320, w: 512 },
          format
        );
        await this.imageStorage.Put(filePath, resolvedImage);
        const UpdatedProfile = await this.UpdateProfile(
          user_id,
          username,
          updated_at,
          filePath,
          bio,
          interests
        );
        resolve({
          responseStatus: {
            statusCode: HerrorStatus.StatusOK,
            message: "successful_Updation",
          },
          profileData: UpdatedProfile,
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  CheckUsername(username: string): Promise<{
    responseStatus: IResponse;
    userData?: EProfile;
  }> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.GetUserByUsername(username);
        if (user === undefined || user === null) {
          resolve({
            responseStatus: {
              statusCode: HerrorStatus.StatusOK,
              message: "username_exists",
            },
          });
        } else {
          resolve({
            responseStatus: {
              statusCode: HerrorStatus.StatusUnauthorized,
              message: "username_already_taken",
            },
          });
        }
      } catch (err) {
        reject(err);
      }
    });
  }
}
