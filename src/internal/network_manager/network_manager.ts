import { Prisma, PrismaClient } from "@prisma/client";
import { parse } from "path";
import { Herror } from "../../pkg/herror/herror";
import { HerrorStatus } from "../../pkg/herror/status_codes";
import ERecommends from "../entities/recommends";
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

  FollowingUpdateDelete(user_id :number){
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

  FollowersUpdateDelete(user_id:number){
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

  async GetComputedRecommendations(user_id: number): Promise<ERecommends | null> {
    return this.store.userRecommendations.findUnique({
      where: {
        user_id,
      },
    });
  }

  async GetTrendingUsers(limit:number, offset:number){
    return this.store.trendingUsers.findMany({
       take:limit,
       skip:offset,
       include:{
         user:{
          select:{
            mail_id:true,
            Profile:{
              select:{
                username:true,
                profile_image_uri:true,
                user_id:true,
                cric_index:true
              }
            }
          }
         }
       }
    })
 }

  async UpdateRecommendations(user_id: number, new_recommends: string){
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

  GetRecommendedUsers(
    recommendations: number[],
    limit: number,
    offset: number
  ) {
    return this.store.users.findMany({
      take: limit,
      skip: offset,
      where: {
        user_id: {
          in: recommendations,
        },
      },
      select: {
        mail_id:true,
        Profile: {
          select: {
            username: true,
            profile_image_uri: true,
            user_id: true,
            cric_index:true
          },
        },
      },
    });
  }

  GetRecommendations(
    user_id: number,
    offset: number,
    limit: number
  ): Promise<{
    responseStatus: IResponse;
    recommended?: any;
  }> {
    return new Promise(async (resolve, reject) => {
      try {
        const parsedRecommendations: number[] =
          await this.PickAndParseRecommends(user_id);

        let truncatedRecommends = await this.GetRecommendedUsers(
          parsedRecommendations,
          limit,
          offset
        );
        const trendingUsers = await this.GetTrendingUsers(limit,offset);
        let uniqueR_ = new Set();
        truncatedRecommends.forEach(r=>{
            uniqueR_.add(r);
        })
        trendingUsers.forEach(r=>{
          uniqueR_.add(r);
        });

        let filteredUsers: any = [];
        uniqueR_.forEach(item=>{
          filteredUsers.push(item);
        })
        resolve({
          responseStatus: {
            statusCode: HerrorStatus.StatusOK,
            message: "recommendations",
          },
          recommended: filteredUsers,
        });
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

        // Recommendations Table updates .....
        // const prevRecommends = await this.PickAndParseRecommends(user_id);
        // const newRecommends = prevRecommends.filter(
        //   (user_id) => user_id !== following_id
        // );
        // const newStringifiedRecommends = JSON.stringify(newRecommends);
        // await this.UpdateRecommendations(user_id, newStringifiedRecommends);

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

  GetFollowers(user_id: number) {
    return new Promise(async (resolve, reject) => {
      try {
        const _followerList = await this.GetMyFollowers(user_id);
        const followerList: {
          username: string;
          profile_pic_uri: string | null;
          user_id: number;
        }[] = [];
        _followerList.forEach((item, index) => {
          if (item.follower.Profile?.username)
            followerList.push({
              username: item.follower.Profile.username,
              profile_pic_uri: item.follower.Profile.profile_image_uri,
              user_id: item.follower.Profile.user_id,
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
        const _followingList = await this.GetWhoAmIFollowing(user_id);
        const followingList: {
          username: string;
          profile_pic_uri: string | null;
          user_id: number;
        }[] = [];
        _followingList.forEach((item, index) => {
          if (item.following.Profile?.username)
            followingList.push({
              username: item.following.Profile.username,
              profile_pic_uri: item.following.Profile.profile_image_uri,
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

  PickAndParseRecommends(user_id: number) : Promise<number[]>{
    return new Promise(async (resolve, reject) => {
      try {
        const recommendations: any = await this.GetComputedRecommendations(
          user_id
        );
        let parsedRecommendations :string[] = [];
        let parsedRecommendations_ :number[] = [];
        if (recommendations !== null ){
            parsedRecommendations = (recommendations.recommend).split("-");
            parsedRecommendations_= parsedRecommendations.map(x=>
              Number(x))
        }
        resolve(parsedRecommendations_);
      } catch (err) {
        reject(err);
      }
    });
  }
}
