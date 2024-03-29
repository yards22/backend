import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import { IFileStorage } from "../../pkg/file_storage/file_storage";
import { HerrorStatus } from "../../pkg/herror/status_codes";
import { ImageResolver } from "../../pkg/image_resolver/image_resolver_";
import { IKVStore } from "../../pkg/kv_store/kv_store";
import EProfile from "../entities/profile";

interface IResponse {
  statusCode: number;
  message?: string;
}

const SEC_IN_YEAR = 31536000;

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

  async GetUserByUsernameBulk(
    username: string,
    offset: number,
    limit: number
  ): Promise<EProfile | null> {
    return await this.store.profile.findUnique({
      where: {
        username: username,
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
      select: {
        username: true,
        cric_index: true,
      },
    });
  }

  UpdateProfileDetails(
    user_id: number,
    token: string,
    rawImage?: Buffer,
    bio?: string,
    name?: string,
    username?: string,
    interests?: string
  ): Promise<{
    responseStatus: IResponse;
    profileData?: EProfile;
  }> {
    return new Promise(async (resolve, reject) => {
      try {
        const format = "jpg";
        let filePath: string | undefined = undefined;

        if (rawImage == undefined) console.log("no image");

        // only if image is there
        if (rawImage !== undefined) {
          filePath = `${user_id}_dp_${randomUUID()}.${format}`;
          let resolvedImage = await this.imageResolver.Convert(
            rawImage,
            { h: 320, w: 512 },
            format
          );
          console.log(filePath);
          await this.imageStorage.Put(filePath, resolvedImage);
        }

        // updating in database
        const updatedProfile = await this.store.profile.update({
          where: {
            user_id: user_id,
          },
          data: {
            username: username,
            profile_image_uri: filePath,
            bio: bio,
            name: name,
            interests,
          },
        });

        const UpdatedProfileDetails: string = JSON.stringify(updatedProfile);
        // also change the profile details in redis for this particular token .
        // but there a raises a problem with expiry TTL.

        await this.cache.Set(token, UpdatedProfileDetails, SEC_IN_YEAR);
        resolve({
          responseStatus: {
            statusCode: HerrorStatus.StatusOK,
            message: "successful_Updation",
          },
          profileData: updatedProfile,
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
        const leaderBoard = await this.GetLeaderBoard(limit, offset);
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
              message: "u_can_pick_this",
            },
          });
        } else {
          resolve({
            responseStatus: {
              statusCode: HerrorStatus.StatusConflict,
              message: "username_already_taken",
            },
          });
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  GetUserPostsById(user_id: number, limit: number, offset: number) {
    return this.store.posts.findMany({
      where: {
        user_id,
      },
      include: { _count: { select: { Likes: true } } },
    });
  }

  GetUserPostsByUsername(username: string, limit: number, offset: number) {
    return this.store.profile.findUnique({
      where: {
        username,
      },
      select: {
        username: true,
        profile_image_uri: true,
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
    });
  }

  GetStaredPostsById(user_id: number, limit: number, offset: number) {
    return this.store.posts.findMany({
      take: limit,
      skip: offset,
      where: {
        user_id,
      },
    });
  }

  GetStaredPostsByUsername(username: string, limit: number, offset: number) {
    return this.store.profile.findUnique({
      where: {
        username,
      },
      select: {
        user: {
          select: {
            Favourites: {
              include: {
                post: {
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
    });
  }
}
