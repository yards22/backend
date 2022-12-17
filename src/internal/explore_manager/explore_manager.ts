import { Networks, PrismaClient, TrendingUsers, UserRecommendations } from "@prisma/client";
import { Network } from "aws-sdk/clients/securityhub";
import { memoryStorage } from "multer";

export default class ExploreManager {
    private store: PrismaClient;
    constructor(store: PrismaClient) {
      this.store = store;
    }

    async GetTrendingPosts(){
        return this.store.trendingPosts.findMany({
          take:10,
          skip:0
        })
    }

    async GetTrendingUsers(limit:number, offset:number){
       return this.store.trendingUsers.findMany({
          take:limit,
          skip:offset
       })
    }

    async GetRecommendedUsers(user_id:number){
      return this.store.userRecommendations.findUnique({
         where:{
          user_id
         }
      });
    }

    async GetFollowing(user_id:number){
       return this.store.networks.findMany({
        where:{
          follower_id:user_id
        }
       })
    }

    ParseRU(str :string) {
        // let parsed_id:number[] = [];
        const stringified_id:string[] = str.split('-');
        const parsed_id:number[] = stringified_id.map(id=>parseInt(id));
        return parsed_id
    }

    async GetUserSuggestions(limit:number,offset:number,user_id:number){
      return new Promise(async(resolve,reject)=>{
         // grp trending nd recommended users together....

         try{
            const ru:UserRecommendations = await this.GetRecommendedUsers(user_id) as UserRecommendations;
            const parsed_ru:number[] = this.ParseRU(ru?.recommend)

            // got recommended.

            const tu:TrendingUsers[] = await this.GetTrendingUsers(limit,offset) as TrendingUsers [];
            const parsed_tu:number[] = tu.map(user=>user.user_id);

            // got trending....

            const following_:Networks[] = await this.GetFollowing(user_id) as Networks[];
            const following:number[] = following_.map(f=>f.following_id);

            // got following ....

            let mySet = new Set();
            let followingSet = new Set();

            parsed_ru.forEach(item=>mySet.add(item));
            parsed_tu.forEach(item=>mySet.add(item));

            following.forEach(item=>{
              if (mySet.has(item)){
                mySet.delete(item);
                followingSet.add(item);
              }
            })

            // let responseList = 
            
            // if(mySet.size>=30){
                
            // }

            // else{

            // }


         }
         catch(err){
           reject(err);
         }
         // make sure no duplicates in showing suggestions ....

          // MAKE SURE TO HAVE RECOMMENDED SIZE OF DISTINCT AROUND 25.
          
      })
    }
}

