import {  PrismaClient } from "@prisma/client";
import { resolve } from "path";
import { off } from "process";
import { Herror } from "../../pkg/herror/herror";
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
                follower:user_id
             }
         })
    }

    GetFollowingOfMultipleUsers(users:any,offset:number,limit:number){
        return this.store.networks.findMany({
            skip:offset,
            take:limit,
            where:{
                following :{ in : users},
            },
        })
    }

    //TODO: To complete recommendations Firstly periodic service need to be done.

    GetRecommendations(user_id:number,offset:number,limit:number):Promise<{ responseStatus: IResponse; recommended?: any }> {
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

      CreateNewConnection(user_id:number,following_id:number):Promise<{responseStatus: IResponse;}>{
         return new Promise(async(resolve,reject)=>{
            try{
                await prisma.$transaction([
                    this.store.networks.create({
                        data:{
                          follower:user_id,
                          following:following_id
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
}