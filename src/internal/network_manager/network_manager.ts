import { Prisma, PrismaClient } from "@prisma/client";
import { HerrorStatus } from "../../pkg/herror/status_codes";
import { ENetworkItem } from "../entities/networkitem";
const prisma = new PrismaClient();

interface IResponse {
  statusCode: number;
  message?: string;
}

export default class NetworkManager {
  private store: PrismaClient;
  constructor(store: PrismaClient) {
    this.store = store;
  }

  GetMyFollowers(user_id: number) {
    return this.store.networks.findMany({
      where: {
        following_id: user_id,
      },
      include: {
        follower: {
          select: {
            Profile: {
              select: {
                user_id: true,
                profile_image_uri: true,
                username: true,
                cric_index: true,
              },
            },
          },
        },
      },
    });
  }

  GetWhoAmIFollowing(user_id: number) {
    return this.store.networks.findMany({
      where: {
        follower_id: user_id,
      },
      include: {
        following: {
          select: {
            Profile: {
              select: {
                user_id: true,
                profile_image_uri: true,
                username: true,
                cric_index: true,
              },
            },
          },
        },
      },
    });
  }

  CreateConnection(follower_id: number, following_id: number) {
    return this.store.networks.create({
      data: {
        follower_id,
        following_id,
      },
    });
  }

  DeleteConnection(follower_id: number, following_id: number) {
    return this.store.networks.delete({
      where: {
        follower_id_following_id: {
          follower_id,
          following_id,
        },
      },
    });
  }

  FollowingUpdate(user_id: number) {
    return this.store.profile.update({
      where: {
        user_id,
      },
      data: {
        following: {
          increment: 1,
        },
      },
    });
  }

  FollowingUpdateDelete(user_id: number) {
    return this.store.profile.update({
      where: {
        user_id,
      },
      data: {
        following: {
          decrement: 1,
        },
      },
    });
  }

  FollowersUpdate(user_id: number) {
    return this.store.profile.update({
      where: {
        user_id,
      },
      data: {
        followers: {
          increment: 1,
        },
      },
    });
  }

  FollowersUpdateDelete(user_id: number) {
    return this.store.profile.update({
      where: {
        user_id,
      },
      data: {
        followers: {
          decrement: 1,
        },
      },
    });
  }

  async GetTrendingUsers(limit: number, offset: number) {
    return this.store.trendingUsers.findMany({
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            mail_id: true,
            Profile: {
              select: {
                username: true,
                profile_image_uri: true,
                user_id: true,
                cric_index: true,
              },
            },
          },
        },
      },
    });
  }

  async UpdateRecommendations(user_id: number, new_recommends: string) {
    return this.store.userRecommendations.update({
      where: {
        user_id,
      },
      data: {
        recommend: new_recommends,
      },
    });
  }

  SearchResults(search_content: string) {
    return this.store.profile.findMany({
      where: {
        username: {
          contains: search_content,
        },
      },
    });
  }

  GetDetailsOfRecommendedUsers(recommendations: number[]) {
    return this.store.users.findMany({
      where: {
        user_id: {
          in: recommendations,
        },
      },
      select: {
        mail_id: true,
        Profile: {
          select: {
            username: true,
            profile_image_uri: true,
            user_id: true,
            cric_index: true,
          },
        },
      },
    });
  }

  GetRecommendations(
    user_id: number,
    offset: number,
    limit: number
  ): Promise<ENetworkItem[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const recommendUsersIds = await this.GetRecommendedUsersFromDB(user_id);

        let recommendUsers = await this.GetDetailsOfRecommendedUsers(
          recommendUsersIds
        );
        const trendingUsers = await this.GetTrendingUsers(limit, offset);
        const followingUsers = await this.GetWhoAmIFollowing(user_id);

        const recommendAndTrendingUsersMap = new Map<number, ENetworkItem>();

        recommendUsers.forEach((v) => {
          if (v.Profile?.user_id && v.Profile.user_id !== user_id)
            recommendAndTrendingUsersMap.set(v.Profile?.user_id, {
              user_id: v.Profile?.user_id,
              username: v.Profile?.username,
              profile_image_uri: v.Profile?.profile_image_uri,
              cric_index: v.Profile?.cric_index,
            });
        });

        trendingUsers.forEach((v) => {
          if (v.user.Profile?.user_id && v.user.Profile.user_id !== user_id)
            recommendAndTrendingUsersMap.set(v.user.Profile.user_id, {
              user_id: v.user.Profile?.user_id,
              username: v.user.Profile?.username,
              profile_image_uri: v.user.Profile?.profile_image_uri,
              cric_index: v.user.Profile?.cric_index,
            });
        });

        let finalListOfRecommendedUsers: ENetworkItem[] = [];

        followingUsers.forEach((v) => {
          const mapItem = recommendAndTrendingUsersMap.get(v.following_id);
          if (mapItem) recommendAndTrendingUsersMap.delete(v.following_id);
        });

        recommendAndTrendingUsersMap.forEach((v) =>
          finalListOfRecommendedUsers.push(v)
        );
        return resolve(finalListOfRecommendedUsers);
      } catch (err) {
        reject(err);
      }
    });
  }

  CreateNewConnection(
    user_id: number,
    following_id: number
  ): Promise<{
    responseStatus: IResponse;
  }> {
    return new Promise(async (resolve, reject) => {
      try {
        await prisma.$transaction([
          this.CreateConnection(user_id, following_id),

          this.FollowingUpdate(user_id),

          this.FollowersUpdate(following_id),
        ]);
        resolve({
          responseStatus: {
            statusCode: HerrorStatus.StatusCreated,
            message: "started_following",
          },
        });
      } catch (err) {
        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === "P2002"
        ) {
          resolve({
            responseStatus: {
              statusCode: HerrorStatus.StatusCreated,
              message: "started_following",
            },
          });
        }
        reject(err);
      }
    });
  }

  UnfollowUser(user_id: number, following_id: number) {
    return new Promise(async (resolve, reject) => {
      try {
        await prisma.$transaction([
          this.DeleteConnection(user_id, following_id),

          this.FollowingUpdateDelete(user_id),

          this.FollowersUpdateDelete(following_id),
        ]);

        resolve("successfully_deleted");
      } catch (err) {
        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === "P2025"
        ) {
          resolve("already_not_following");
        }
        reject(err);
      }
    });
  }

  GetFollowers(user_id: number): Promise<ENetworkItem[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const followerList: ENetworkItem[] = [];
        (await this.GetMyFollowers(user_id)).forEach((item) => {
          if (item.follower.Profile?.username)
            followerList.push({
              user_id: item.follower_id,
              cric_index: item.follower.Profile.cric_index,
              profile_image_uri: item.follower.Profile.profile_image_uri,
              username: item.follower.Profile.username,
            });
        });
        resolve(followerList);
      } catch (err) {
        reject(err);
      }
    });
  }

  GetFollowing(user_id: number) {
    return new Promise(async (resolve, reject) => {
      try {
        const followingList: ENetworkItem[] = [];
        (await this.GetWhoAmIFollowing(user_id)).forEach((item, index) => {
          if (item.following.Profile?.username)
            followingList.push({
              username: item.following.Profile.username,
              cric_index: item.following.Profile.cric_index,
              profile_image_uri: item.following.Profile.profile_image_uri,
              user_id: item.following.Profile.user_id,
            });
        });
        resolve(followingList);
      } catch (err) {
        reject(err);
      }
    });
  }

  GetSearchedUsers(search_content: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const searchResults = await this.SearchResults(search_content);
        resolve(searchResults);
      } catch (err) {
        reject(err);
      }
    });
  }

  GetRecommendedUsersFromDB(user_id: number): Promise<number[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const recommendations = await this.store.userRecommendations.findUnique(
          {
            where: {
              user_id,
            },
          }
        );
        if (!recommendations) return resolve([]);
        if (recommendations.recommend === "null") return resolve([]);
        resolve(
          (JSON.parse(recommendations.recommend) as string[]).map((v) =>
            Number(v)
          )
        );
      } catch (err) {
        reject(err);
      }
    });
  }
}
