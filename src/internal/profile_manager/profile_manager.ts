import { PrismaClient } from "@prisma/client";
import { IFileStorage } from "../../pkg/file_storage/file_storage";
import { HerrorStatus } from "../../pkg/herror/status_codes";
import { ImageResolver } from "../../pkg/image_resolver/image_resolver_";
import { IKVStore } from "../../pkg/kv_store/kv_store";
import EProfile from "../entities/profile";

interface IResponse {
  statusCode: number;
  message?: string;
}

export default class ProfileManager {
  private store: PrismaClient;
  private imageStorage: IFileStorage;
  private imageResolver: ImageResolver;
  private cache: IKVStore;
  constructor(
    store: PrismaClient,
    imageResolver: ImageResolver,
    imageStorage: IFileStorage,
    cache: IKVStore
  ) {
    this.store = store;
    this.imageStorage = imageStorage;
    this.imageResolver = imageResolver;
    this.cache = cache;
  }

  GetUserByUsername(username: string): Promise<EProfile | null> {
    return this.store.profile.findUnique({
      where: {
        username,
      },
    });
  }

  async GetUserPrimaryInfoById(user_id: number): Promise<EProfile | null> {
    return await this.store.profile.findUnique({
      where: {
        user_id: user_id,
      },
    });
  }

  async GetUserProfileById(
    user_id: number,
    offset: number,
    limit: number
  ): Promise<EProfile | null> {
    return await this.store.profile.findUnique({
      where: {
        user_id: user_id,
      },
      include: {
        user: {
          select: {
            Post: {
              take: limit,
              skip: offset,
              include: {
                _count: {
                  select: {
                    Likes: true,
                    ParentComments: true,
                  },
                },
              },
            },
            Favourites: {
              take: limit,
              skip: offset,
              include: {
                user: {
                  select: {
                    Post: {
                      include: {
                        _count: {
                          select: {
                            Likes: true,
                            ParentComments: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  GetLeaderBoard(limit: number, offset: number) {
    return this.store.profile.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        cric_index: "desc",
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
    token: string,
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

        const UpdatedProfileDetails: string = JSON.stringify(UpdatedProfile);
        // also change the profile details in redis for this particular token .
        // but there a raises a problem with expiry TTL.

        await this.cache.Set(token, UpdatedProfileDetails, SEC_IN_YEAR);
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

  GetCommunityLeaderBoard(
    limit: number,
    offset: number
  ): Promise<{
    responseStatus: IResponse;
    leaderBoard: any;
  }> {
    return new Promise(async (resolve, reject) => {
      try {
        const leaderBoard = await this.GetCommunityLeaderBoard(limit, offset);
        resolve({
          responseStatus: {
            statusCode: HerrorStatus.StatusOK,
            message: "community_leaderboard",
          },
          leaderBoard,
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

  GetMyPosts(user_id: number, limit: number, offset: number) {
    new Promise(async (resolve, reject) => {
      try {
        const posts = await this.store.posts.findMany({
          take: limit,
          skip: offset,
          where: {
            user_id,
          },
        });
        resolve(posts);
      } catch (err) {
        reject(err);
      }
    });
  }

  GetBookmarkedPosts(user_id: number, limit: number, offset: number) {
    new Promise(async (resolve, reject) => {
      try {
        const posts = await this.store.posts.findMany({
          take: limit,
          skip: offset,
          where: {
            user_id,
          },
        });
        resolve(posts);
      } catch (err) {
        reject(err);
      }
    });
  }
}
