import { Networks, PrismaClient, TrendingUsers, UserRecommendations } from "@prisma/client";
import { Network } from "aws-sdk/clients/securityhub";
import { bool } from "aws-sdk/clients/signer";
import { memoryStorage } from "multer";
import { ImageResolver } from "../../pkg/image_resolver/image_resolver_";
import { IFileStorage } from "../../pkg/file_storage/file_storage";
import { userInfo } from "os";


const ALLOWED_IMAGES = 4;
const MAX_WIDTH = 1080;
export default class ExploreManager {
    private store: PrismaClient;
    private imageStorage: IFileStorage;
    private imageResolver: ImageResolver;
    constructor(store: PrismaClient,imageResolver:ImageResolver,imageStorage:IFileStorage) {
      this.store = store;
      this.imageResolver= imageResolver,
      this.imageStorage= imageStorage
    }

    async GetTrendingPosts(limit:number,offset:number){
        return this.store.trendingPosts.findMany({
          take:limit,
          skip:offset
        })
    }

    async GetTrendingUsers(limit:number, offset:number){
       return this.store.trendingUsers.findMany({
          take:limit,
          skip:offset
       })
    }

    async GetSuggestedUsers(user_id:number){
      return this.store.userRecommendations.findUnique({
         where:{
          user_id
         }
      });
    }

    async GetRecommendedUsers(limit:number, offset:number,user_id:number){
      // cumilative sum of suggested and trending filtering out common ones.
      const suggestedUsers = await this.GetSuggestedUsers(user_id);
      const trendingUsers = await this.GetTrendingUsers(limit,offset);
      
      // Return combination of suggested and trending without duplicates 
      // Also filter out the existing connections.

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
            const ru:UserRecommendations = await this.GetSuggestedUsers(user_id) as UserRecommendations;
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

    async Delete(story_id:number) {
      await this.store.stories.delete({
        where: {
          story_id 
        }
      });
    }

    async UpdateMediaRef(
      user_id: number,
      story_id: number,
      added: string[],
      removed: string[],
      is_new: bool
    ) {
      try {
        const currentImagesRef = await this.store.stories.findUnique({
          where: { story_id },
        });
        if (!currentImagesRef) throw new Error("Story not found");
  
        let updatedMediaRef =
          currentImagesRef.media !== null
            ? (JSON.parse(currentImagesRef.media) as string[])
            : [];
  
        // removing removed images from db array
        updatedMediaRef = updatedMediaRef.filter((item) => {
          if (removed.includes(item)) return false;
          return true;
        });
  
        // adding the new images to the db array
        added.forEach((item) => {
          if (!updatedMediaRef.includes(item)) updatedMediaRef.push(item);
        });
  
        if (is_new) {
          try {
            await this.store.stories.update({
              data: { media: JSON.stringify(updatedMediaRef) },
              where: { story_id },
            });
          } catch (err) {
            throw err;
          }
        } else {
          return JSON.stringify(updatedMediaRef);
        }
      } catch (err) {
        throw err;
      }
    }

    async UploadMedias(
      user_id: number,
      story_id: number,
      medias: Buffer[],
      edits: number,
      removed_images: string,
      is_new: bool
    ) {
      const mediaRef = medias.map((_, index) => {
        console.log(edits, index);
        return `media_${story_id}_${edits * (ALLOWED_IMAGES-1) + index}.${
          this.imageResolver.defaultFormat
        }`;
      });
  
      for (let i = 0; i < Math.min(ALLOWED_IMAGES, medias.length); i++) {
        try {
          const imagesMetadata = await this.imageResolver.Metadata(medias[i]);
          let imageWidth = imagesMetadata.width || 1080;
          if (imageWidth > MAX_WIDTH) imageWidth = MAX_WIDTH;
  
          try {
            // uploading image
  
            await this.imageStorage.Put(
              mediaRef[i],
  
              // converting image
              await this.imageResolver.Convert(medias[i], { w: imageWidth })
            );
          } catch (err) {
            // media upload failed
            throw err;
          }
        } catch (err) {
          console.log(err);
        }
  
        // considering max width check
      }
      // -----------------media upload completed----------------
  
      // updating stringified media ref...
      try {
        if (is_new) {
          await this.UpdateMediaRef(user_id, story_id, mediaRef, [], is_new);
        } else {
          const removed: string[] = JSON.parse(removed_images as string);
          return await this.UpdateMediaRef(
            user_id,
            story_id,
            mediaRef,
            removed || [],
            is_new
          );
        }
      } catch (err) {
        // updating media ref in db failed: delete images from storage
        try {
          for (let i = 0; i < ALLOWED_IMAGES; i++) {
            await this.imageStorage.Delete(
              `media_${story_id}_${i}.${this.imageResolver.defaultFormat}`
            );
          }
        } catch (err) {
          throw err;
        }
        throw err;
      }
    }

    async GetStories(limit:number,offset:number){
       return this.store.stories.findMany({
          take:limit,
          skip:offset
       })
    }

    async CreateStories(user_id:number, content :string, medias:Buffer[]){
      return new Promise(async (resolve, reject) => {
        try {
          const story = await this.store.stories.create({
            data: {
              content,
              user_id: user_id,
              media: JSON.stringify([]),
            },
          });
  
          try {
            const removed_images: string = "";
            await this.UploadMedias(
              user_id,
              story.story_id,
              medias,
              0,
              removed_images,
              true // is_new
            );
            resolve("story_uploaded_succesfully");
          } catch (err) {
            // image upload failed, rollback: delete story.
            try {
              await this.Delete(story.story_id);
              resolve("unable_to_upload_media");
            } catch (err) {
              throw err;
            }
            throw err;
          }
        } catch (err) {
          throw err;
        }
      });
    }
}

