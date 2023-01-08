import { PrismaClient } from "@prisma/client";
import { bool } from "aws-sdk/clients/signer";
import { appendFile } from "fs";
import MimeNode from "nodemailer/lib/mime-node";
import { json } from "stream/consumers";
import { IFileStorage } from "../../pkg/file_storage/file_storage";
import { ImageResolver } from "../../pkg/image_resolver/image_resolver_";
import { IKVStore } from "../../pkg/kv_store/kv_store";
import EPost from "../entities/post";
import { ReconnectStrategyError } from "redis";
const prisma = new PrismaClient();

const ALLOWED_IMAGES = 3;
const MAX_WIDTH = 1080;

interface IFollower {
  following_id: number;
}

export default class PostManager {
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

  GetByID(
    id: number,
    limit: number,
    offset: number,
    includeLikeCount: boolean
  ) {
    return this.store.posts.findMany({
      where: { user_id: id },
      include: { _count: { select: { Likes: includeLikeCount } } },
      skip: offset,
      take: limit,
    });
  }

  async Create(
    user_id: number,
    content: string,
    medias: Buffer[]
  ): Promise<EPost> {
    return new Promise(async (resolve, reject) => {
      try {
        // creating post entry in db
        const post = await this.store.posts.create({
          data: {
            content,
            user_id: user_id,
            media: JSON.stringify([]),
          },
        });

        try {
          // uploading media
          const removed_images: string = "";
          await this.UploadMedias(
            user_id,
            post.post_id,
            medias,
            0,
            removed_images,
            true // is_new
          );
          resolve(post);
        } catch (err) {
          // image upload failed, rollback: delete post
          try {
            await this.Delete(user_id, post.post_id);
            reject("unable_to_upload_media");
          } catch (err) {
            reject(err);
          }
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  async Update(
    user_id: number,
    post_id: bigint,
    removed_images: string,
    medias: Buffer[],
    edits: number,
    content?: string
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        const images = await this.UploadMedias(
          user_id,
          post_id,
          medias as Buffer[],
          edits + 1,
          removed_images,
          false // is_new
        );
        try {
          const data = await this.store.posts.update({
            where: { user_id_post_id: { post_id: post_id, user_id: user_id } },
            data: {
              content,
              media: images,
              edits: {
                increment: 1,
              },
            },
          });
          resolve(data);
        } catch (err) {
          reject(err);
        }
      } catch (err) {
        resolve("unable_to_upload_media");
      }
    });
  }

  async Delete(user_id: number, post_id: bigint) {
    await this.store.posts.deleteMany({
      where: { AND: { user_id, post_id } },
    });
  }

  // TODO: what if the post which is shared contains of images as well.
  async ShareToTimeline(user_id: number, original_id: bigint, content: string) {
    return this.store.posts.create({
      data: { content, user_id: user_id, original_id },
    });
  }

  async UpdateMediaRef(
    user_id: number,
    post_id: bigint,
    added: string[],
    removed: string[],
    is_new: bool
  ) {
    try {
      const currentImagesRef = await this.store.posts.findUnique({
        where: { user_id_post_id: { post_id, user_id } },
      });
      if (!currentImagesRef) throw new Error("post not found");

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
          await this.store.posts.update({
            data: { media: JSON.stringify(updatedMediaRef) },
            where: { user_id_post_id: { user_id, post_id } },
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
    post_id: bigint,
    medias: Buffer[],
    edits: number,
    removed_images: string,
    is_new: bool
  ) {
    const mediaRef = medias.map((_, index) => {
      console.log(edits, index);
      return `media_${post_id}_${edits * 3 + index}.${
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
        await this.UpdateMediaRef(user_id, post_id, mediaRef, [], is_new);
      } else {
        const removed: string[] = JSON.parse(removed_images as string);
        return await this.UpdateMediaRef(
          user_id,
          post_id,
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
            `media_${post_id}_${i}.${this.imageResolver.defaultFormat}`
          );
        }
      } catch (err) {
        throw err;
      }
      throw err;
    }
  }

  async BookmarkPosts(user_id: number, post_id: bigint) {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await this.store.favourites.create({
          data: {
            user_id,
            post_id,
          },
        });
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }

  async DeleteBookmarkedPosts(user_id: number, post_id: bigint) {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await this.store.favourites.delete({
          where: {
            user_id_post_id: { user_id, post_id },
          },
        });
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }

  async GetFollowing(user_id: number) {
    return this.store.networks.findMany({
      where: {
        follower_id: user_id,
      },
      select: {
        following_id: true,
      },
    });
  }

  async GetPostsOfUsers(users: any, limit: number, offset: number) {
    return this.store.posts.findMany({
      take: limit,
      skip: offset,
      where: {
        user_id: {
          in: users,
        },
      },
      include: { _count: { select: { Likes: true } } },
    });
  }

  async GetPostRecommendations(user_id: any) {
    return this.store.postRecommendations.findUnique({
      where: {
        user_id,
      },
    });
  }

  async GetPostsById(post_id: number[], limit: number, offset: number) {
    return this.store.posts.findMany({
      take: limit,
      skip: offset,
      where: {
        post_id: {
          in: post_id,
        },
      },
      include: { _count: { select: { Likes: true } } },
    });
  }

  async GetUsersFeed(user_id: number, limit: number, offset: number) {
    return new Promise(async (resolve, reject) => {
      try {
        let posts: any = [];
        let following_: IFollower[] = [];

        following_ = await this.GetFollowing(user_id);

        // xtraxt id's from following object array..

        const following = following_.forEach((item) => {
          item.following_id;
        });

        // get posts of these users.

        posts = await this.GetPostsOfUsers(following, limit, offset);

        let recommended_posts: any = [];

        // recommendation of posts by lcm service..

        recommended_posts = await this.GetPostRecommendations(user_id);
        const r_p = (recommended_posts.post_recommendations).split(",");
        console.log(r_p);


        if(recommended_posts !== null){
          let r_p1: number[]  = []
          r_p.forEach((id: any)=>{
             r_p1.push(Number(id));
          })
          let rec_posts = await this.GetPostsById(
            r_p1,
            limit,
            offset
          );
  
          rec_posts.forEach((post) => {
            posts.push(post);
          });
        }
        // posts contains all the posts to be displayed
        resolve(posts);
      } catch (err) {
        reject(err);
      }
    });
  }
}
