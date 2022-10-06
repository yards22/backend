import {  PrismaClient } from "@prisma/client";
import { parse } from "path";
import { HerrorStatus } from "../../pkg/herror/status_codes";
import ERecommends from "../entities/recommends";
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

    CreateConnection(follower_id:number,following_id:number){
        return this.store.networks.create({
            data:{
                follower_id,
                following_id
              }
        })
    }

    DeleteConnection(follower_id:number,following_id:number){
        return this.store.networks.delete({
            where:{
                follower_id_following_id:{
                    follower_id,
                    following_id
                }
            }
        })
    }

    FollowingUpdate(user_id:number){
        return this.store.profile.update({
            where:{
                user_id
            },
            data:{
              following:{
                  increment:1
              } 
            }
         })
    }


    FollowersUpdate(user_id:number){
        return this.store.profile.update({
            where:{
                user_id
            },
            data:{
                followers:{
                    increment:1
                } 
            }
        })
    }

    GetComputedRecommendations(user_id:number):Promise<ERecommends|null>{
        return this.store.recommendations.findUnique({
            where:{
                user_id
            }
        })
    }

    UpdateRecommendations(user_id:number,new_recommends:string):void{
        this.store.recommendations.update({
            where:{
              user_id
            },
            data:{
              recommend:new_recommends
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

    GetRecommendedUsers(recommendations:number[],limit:number,offset:number){
        return this.store.users.findMany({
            take:limit,
            skip:offset,
            where:{
                user_id:{
                    in:recommendations
                }
            },
            select:{
                Profile:{
                    select:{
                        username:true,
                        profile_image_uri:true,
                        user_id:true,
                    }
                }
            }
        });
    }

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
               
              const parsedRecommendations:Array<number>  = await this.PickAndParseRecommends(user_id);
              
               let truncatedRecommends = await this.GetRecommendedUsers(parsedRecommendations,limit,offset);
               resolve({
                  responseStatus:{
                    statusCode:HerrorStatus.StatusOK,
                    message:"recommendations",
                  },
                  recommended:truncatedRecommends
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
            responseStatus: IResponse,
        }>{
         return new Promise(async(resolve,reject)=>{
            try{
                await prisma.$transaction([
                    this.CreateConnection(user_id,following_id),

                    this.FollowingUpdate(following_id),

                    this.FollowersUpdate(user_id)
                ])

                // Recommendations Table updates .....
                const prevRecommends = await this.PickAndParseRecommends(user_id);
                const newRecommends = prevRecommends.filter(user_id=>user_id!==following_id); 
                const newStringifiedRecommends = JSON.stringify(newRecommends);
                await this.UpdateRecommendations(user_id,newStringifiedRecommends);

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

      UnfollowUser(user_id:number,following_id:number){
        return new Promise(async(resolve,reject)=>{
            try{
              await this.DeleteConnection(user_id,following_id);
              resolve("successfully_deleted");
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
     
     PickAndParseRecommends(user_id:number):Promise<Array<number>>{
        return new Promise(async(resolve,reject)=>{
           try{
            const recommendations:any = await this.GetComputedRecommendations(user_id);
            const parsedRecommendations:Array<number> = JSON.parse(recommendations);
            resolve(parsedRecommendations);
           }
           catch(err){
             reject(err);
           }
        })
    }


}