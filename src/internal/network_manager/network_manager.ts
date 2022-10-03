import {  PrismaClient } from "@prisma/client";
import { HerrorStatus } from "../../pkg/herror/status_codes";
const prisma = new PrismaClient();

interface IResponse {
    statusCode: number;
    message?: string;
}

export default class NetworkManager{
    private store: PrismaClient
    constructor(
        store:PrismaClient
    ) {
        this.store = store;
    }

    GetFollowingUsers(user_id:number){
         return this.store.networks.findMany({
             where:{
                follower_id:user_id
             }
         })
    }

    GetFollowingOfMultipleUsers(users:any,offset:number,limit:number){
        return this.store.networks.findMany({
            skip:offset,
            take:limit,
            where:{
                following_id :{ in : users},
            },
        })
    }

    GetMyFollowers(user_id:number){
        return this.store.networks.findMany({
            where:{
                following_id:user_id
            },
            select:{
                follower:{
                    select:{
                        Profile:{
                            select:{
                                user_id:true,
                                profile_image_uri:true,
                                username:true
                            }
                        }
                    }
                }
            }
        })
    }

    GetWhoAmIFollowing(user_id:number){
       return this.store.networks.findMany({
            where:{
               follower_id:user_id
            },
            select:{
                following:{
                    select:{
                        Profile:{
                            select:{
                                user_id:true,
                                profile_image_uri:true,
                                username:true
                            }
                        }
                    }
                }
            }
       })
    }

    SearchResults(search_content:string){
        return this.store.profile.findMany({
            where:{
                username:{
                    contains:search_content,
                }
            }
        })
    }

    //TODO: To complete recommendations Firstly periodic service need to be done.

    GetRecommendations(
        user_id:number,
        offset:number,
        limit:number
        ): Promise<{ 
          responseStatus: IResponse; 
          recommended?: any
        }> {
         return new Promise(async (resolve,reject)=>{
            try{
               const following = await this.GetFollowingUsers(user_id);
               const requiredFollowing = await this.GetFollowingOfMultipleUsers(following,offset,limit);

               // chance of getting duplicates.
               // chance of getting connections which iam already following

               resolve({
                  responseStatus:{
                    statusCode:HerrorStatus.StatusOK,
                    message:"recommendations",
                  },
                  recommended:requiredFollowing
               });
            }
            catch(err){
                reject(err);
            }
         })
      }

      CreateNewConnection(
        user_id:number,
        following_id:number
        ):Promise<{
            responseStatus: IResponse;
        }>{
         return new Promise(async(resolve,reject)=>{
            try{
                await prisma.$transaction([
                    this.store.networks.create({
                        data:{
                          follower_id:user_id,
                          following_id:following_id
                        }
                     }),

                     this.store.profile.update({
                        where:{
                            user_id
                        },
                        data:{
                          following:{
                              increment:1
                          } 
                        }
                     }),

                     this.store.profile.update({
                        where:{
                            user_id:following_id
                        },
                        data:{
                          followers:{
                              increment:1
                          } 
                        }
                     }),
                ])
                resolve({
                    responseStatus:{
                        statusCode:HerrorStatus.StatusOK,
                        message:"started_following"
                    }
                })
            }
            catch(err){
                 reject(err);
            }
         })
      }

      GetFollowers(user_id:number){
         return new Promise(async(resolve,reject)=>{
            try{
              const followerList = await this.GetMyFollowers(user_id);
              resolve(followerList);
            }
            catch(err){
                reject(err);
            }
         })
      } 

      GetFollowing(user_id:number){
        return new Promise(async(resolve,reject)=>{
           try{
             const followingList = await this.GetWhoAmIFollowing(user_id);
             resolve(followingList);
           }
           catch(err){
               reject(err);
           }
        })
     } 

     GetSearchedUsers(search_content:string){
        return new Promise(async(resolve,reject)=>{
            try{
               const searchResults = await this.SearchResults(search_content);
               resolve(searchResults);
            }
            catch(err){
                reject(err);
            }
        })
     }


}