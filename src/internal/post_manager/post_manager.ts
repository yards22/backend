import { PrismaClient } from "@prisma/client";
import { bool } from "aws-sdk/clients/signer";
import { appendFile } from "fs";
import MimeNode from "nodemailer/lib/mime-node";
import { json } from "stream/consumers";
import { IFileStorage } from "../../pkg/file_storage/file_storage";
import { ImageResolver } from "../../pkg/image_resolver/image_resolver_";
import { IKVStore } from "../../pkg/kv_store/kv_store";
import EPost from "../entities/post";
import { EFeedMeta, EFeedItem, EPostFinal } from "../entities/feeditem";
import {
  formatFavResponse,
  formatFeedResponse,
  formatFeedResponseUsername,
  formatTrendingFeedResponse,
} from "../../util/responseFormat";
import { detailsMixers } from "../../util/postDetailsMixer";
import { Herror } from "../../pkg/herror/herror";

const ALLOWED_IMAGES = 4;
const MAX_WIDTH = 1080;

interface IFollower {
  following_id: number;
}
interface IResponse {
  statusCode: number;
  message?: string;
}
interface ILikedData {
  postId: bigint;
  likeStatus: bool;
}
interface IFavouriteData {
  postId: bigint;
  favouriteStatus: bool;
}
interface ILikedUsers {
  postId: bigint;
  username: string[];
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
    medias: Buffer[],
    content?: string
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
          console.log("iam here")
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

  async DeleteMedia(medias:String[]){
    const mediaRef = medias.map((uri, _) => {
      return `${uri}`;
    });

    for (let i = 0; i < Math.min(ALLOWED_IMAGES, medias.length); i++) {
      try {

        try {
          // uploading image
          console.log(mediaRef[i]);
          await this.imageStorage.Delete(
            mediaRef[i],
          );
        } catch (err) {
          console.log(err)
          // media upload failed
          throw err;
        }
      } catch (err) {
        console.log(err);
      }

      // considering max width check
    }

  }

  async DeleteEntirePost(user_id:number,post_id:bigint){
    try{
       // pick the post
        const post  = await this.store.posts.findUnique({
          where:{
            post_id
          }
        });
        console.log(user_id,post)
        if (user_id === post?.user_id){
           // if media is present
          if(post?.media !== null && post?.media!== undefined){
            const media = JSON.parse(post?.media)
            await this.DeleteMedia(
              media
            );
          }
          await this.store.posts.deleteMany({
              where: { AND: { user_id, post_id } },
          })
        }
        else{
          throw(new Herror("unauthorised to delete",404))
          // unauthorised for this action
        }

     }
     catch(err){
        throw(new Herror("unauthorised to delete",404))
     }
  }

  // TODO: what if the post which is shared contains of images as well.
  async ShareToTimeline(user_id: number, original_id: bigint, content: string) {
    return this.store.posts.create({
      data: { content, user_id: user_id, original_id },
    });
  }

  async GetPostByID(post_id: bigint, user_id: number) {
    try {
      const post = await this.store.posts.findUnique({
        where: { post_id },
        include: {
          user: {
            select: {
              Profile: {
                select: {
                  username: true,
                  profile_image_uri: true,
                },
              },
            },
          },
          _count: { select: { Likes: true } },
        },
      });
      if (post) {
        const feedPost: EFeedItem = {
          user_id: post.user_id,
          post_id: post.post_id,
          content: post.content,
          media: JSON.parse(post.media || "[]"),
          original_id: post.original_id,
          created_at: post.created_at,
          updated_at: post.updated_at,
          likes: post._count.Likes,
          username: post.user.Profile?.username || "",
          profile_pic_ref:
            post.user.Profile?.profile_image_uri || undefined || null,
        };

        const metadata: EFeedMeta = await this.GetPostMetadata(
          [post.post_id],
          user_id
        );
        const finalPost: EPostFinal[] = detailsMixers([feedPost], metadata);
        return finalPost[0];
      }
      return;
    } catch (err) {
      throw err;
    }
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
         console.log("here at uploading")
          await this.imageStorage.Put(
            mediaRef[i],

            // converting image
            await this.imageResolver.Convert(medias[i], { w: imageWidth })
          );
        } catch (err) {
          console.log(err)
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

  async createStarredPosts(user_id: number, post_id: bigint) {
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

  async deleteStarredPosts(user_id: number, post_id: bigint) {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await this.store.favourites.deleteMany({
          where: {
            AND: [{ user_id: user_id }, { post_id: post_id }],
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

  GetFollowing(user_id: number) {
    return this.store.networks.findMany({
      where: {
        follower_id: user_id,
      },
      select: {
        following_id: true,
      },
    });
  }

  async GetFollowingUsername(user_id: number) {
    new Promise(async (resolve, reject) => {
      try {
        const followingList = await this.store.networks.findMany({
          where: {
            follower_id: user_id,
          },
          include: {
            following: {
              include: {
                Profile: {
                  select: {
                    username: true,
                  },
                },
              },
            },
          },
        });
        let finalList: string[];
        followingList.forEach((item) =>
          finalList.push(item.following.Profile?.username as string)
        );
        resolve(followingList);
      } catch (err) {
        reject(err);
      }
    });
  }

  async GetPostsOfUsers(users: any, limit: number, offset: number) {
    return this.store.posts.findMany({
      // take: limit,
      // skip: offset,
      where: {
        user_id: {
          in: users,
        },
      },
      include: {
        user: {
          select: {
            mail_id: true,
            Profile: {
              select: {
                username: true,
                profile_image_uri: true,
              },
            },
          },
        },
        _count: { select: { Likes: true } },
      },
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
      include: {
        user: {
          select: {
            mail_id: true,
            Profile: {
              select: {
                username: true,
                profile_image_uri: true,
              },
            },
          },
        },
        _count: { select: { Likes: true } },
      },
    });
  }

  async GetUsersFeed(user_id: number, limit: number, offset: number) {
    return new Promise(async (resolve, reject) => {
      try {
        let posts: any = [];
        let following_: IFollower[] = [];

        following_ = await this.GetFollowing(user_id);

        // xtraxt id's from following object array..
        let following: any = [];
        if (following_.length !== 0) {
          following_.forEach((item) => {
            following.push(item.following_id);
          });
          following.push(user_id);
        }

        // get posts of these users.

        posts = await this.GetPostsOfUsers(following, limit, offset);
        let recommended_posts: any = [];

        // recommendation of posts by lcm service..
        recommended_posts = await this.GetPostRecommendations(user_id);
        if (recommended_posts !== null) {
          const r_p = recommended_posts.post_recommendations.split(",");
          let r_p1: number[] = [];
          r_p.forEach((id: any) => {
            r_p1.push(Number(id));
          });
          let rec_posts = await this.GetPostsById(r_p1, limit, offset);

          let distinct_posts = new Set();

          posts.forEach((post: any) => {
            distinct_posts.add(post);
          });

          rec_posts.forEach((post) => {
            distinct_posts.add(post);
          });

          let filtered_posts: any = [];

          distinct_posts.forEach((post) => {
            filtered_posts.push(post);
          });

          // collect post_ids and send it to.
          let post_ids: bigint[] = [];
          filtered_posts.forEach((post: any) =>
            post_ids.push(BigInt(post.post_id))
          );
          // call GetPostMetaData.
          const Metadata: EFeedMeta = await this.GetPostMetadata(
            post_ids,
            user_id
          );
          const posts_: EFeedItem[] = formatFeedResponse(filtered_posts);
          const finalPosts: EPostFinal[] = detailsMixers(posts_, Metadata);
          resolve(finalPosts);
          return;
        }
        let post_ids: bigint[] = [];
        posts.forEach((post: any) => post_ids.push(BigInt(post.post_id)));
        // call GetPostMetaData.
        const Metadata: EFeedMeta = await this.GetPostMetadata(
          post_ids,
          user_id
        );
        const posts_: EFeedItem[] = formatFeedResponse(posts);
        const finalPosts: EPostFinal[] = detailsMixers(posts_, Metadata);
        resolve(finalPosts);
        return;
      } catch (err) {
        reject(err);
      }
    });
  }

  isLiked(post_ids: any, user_id: number) {
    return this.store.likes.findMany({
      where: {
        AND: [
          { user_id },
          {
            post_id: {
              in: post_ids,
            },
          },
        ],
      },
      select: {
        post_id: true,
      },
    });
  }

  isFavourite(post_ids: any, user_id: number) {
    return this.store.favourites.findMany({
      where: {
        AND: [
          { user_id },
          {
            post_id: {
              in: post_ids,
            },
          },
        ],
      },
      select: {
        post_id: true,
      },
    });
  }

  likedUsers(post_ids: bigint[]) {
    return this.store.likes.findMany({
      where: {
        post_id: {
          in: post_ids,
        },
      },
      include: {
        user: {
          select: {
            Profile: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });
  }

  async GetPostMetadata(
    post_ids: bigint[],
    user_id: number
  ): Promise<{
    isLiked: ILikedData[];
    isFavourite: IFavouriteData[];
    likedUsers: ILikedUsers[];
  }> {
    return new Promise(async (resolve, reject) => {
      try {
        // get is_liked,is_favourite arrays.
        let liked_: ILikedData[] = [];
        const isLikedData = await this.isLiked(post_ids, user_id);
        post_ids.forEach((post_id) => {
          const isLiked: { post_id: bigint }[] = isLikedData.filter(
            (x) => BigInt(x.post_id) === post_id
          );
          if (isLiked.length === 0) {
            liked_.push({ postId: post_id, likeStatus: false });
          } else {
            liked_.push({ postId: post_id, likeStatus: true });
          }
        });

        let favourite_: IFavouriteData[] = [];
        const isFavouriteData = await this.isFavourite(post_ids, user_id);
        post_ids.forEach((post_id) => {
          const isFavourite: { post_id: bigint }[] = isFavouriteData.filter(
            (x) => BigInt(x.post_id) === post_id
          );
          if (isFavourite.length === 0) {
            favourite_.push({ postId: post_id, favouriteStatus: false });
          } else {
            favourite_.push({ postId: post_id, favouriteStatus: true });
          }
        });

        // get liked users list.
        let likedUsers_: ILikedUsers[] = [];
        const likedUsersResults = await this.likedUsers(post_ids);
        post_ids.forEach((post_id) => {
          const isLikedUsers = likedUsersResults.filter(
            (x) => BigInt(x.post_id) === post_id
          );
          let isLikedUsers_: string[] = [];
          isLikedUsers.forEach((x) => {
            if (x.user.Profile) isLikedUsers_.push(x.user.Profile?.username);
          });
          likedUsers_.push({
            postId: post_id,
            username: isLikedUsers_,
          });
        });

        resolve({
          isLiked: liked_,
          isFavourite: favourite_,
          likedUsers: likedUsers_,
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  async GetTrendingPosts_(limit: number, offset: number) {
    return this.store.trendingPosts.findMany({
      distinct: ["post_id"],
      take: limit,
      skip: offset,
      include: {
        post: {
          include: {
            user: {
              select: {
                Profile: {
                  select: {
                    username: true,
                    profile_image_uri: true,
                  },
                },
              },
            },
            _count: { select: { Likes: true } },
          },
        },
      },
    });
  }

  async GetTrendingPosts(user_id: number, limit: number, offset: number) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await this.GetTrendingPosts_(limit, offset);
        //extract post_ids ...
        let post_ids: bigint[] = [];
        res.forEach((post: any) => post_ids.push(BigInt(post.post_id)));
        const Metadata: EFeedMeta = await this.GetPostMetadata(
          post_ids,
          user_id
        );
        const posts: EFeedItem[] = formatTrendingFeedResponse(res);
        const finalPosts: EPostFinal[] = detailsMixers(posts, Metadata);
        resolve(finalPosts);
      } catch (err) {
        reject(err);
      }
    });
  }

  GetUserPostsById_(user_id: number, limit: number, offset: number) {
    return this.store.posts.findMany({
      where: {
        user_id,
      },
      include: {
        user: {
          select: {
            Profile: {
              select: {
                username: true,
                profile_image_uri: true,
              },
            },
          },
        },
        _count: { select: { Likes: true } },
      },
    });
  }

  async GetUserPostsById(
    user_id_: number,
    user_id: number,
    limit: number,
    offset: number
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await this.GetUserPostsById_(user_id_, limit, offset);
        let post_ids: bigint[] = [];
        res.forEach((post: any) => post_ids.push(BigInt(post.post_id)));
        const Metadata: EFeedMeta = await this.GetPostMetadata(
          post_ids,
          user_id
        );
        const posts: EFeedItem[] = formatFeedResponse(res);
        const finalPosts: EPostFinal[] = detailsMixers(posts, Metadata);
        resolve(finalPosts);
      } catch (err) {
        reject(err);
      }
    });
  }

  GetStarredPostsById_(user_id: number, limit: number, offset: number) {
    return this.store.favourites.findMany({
      where: {
        user_id,
      },
      include: {
        post: {
          include: {
            user: {
              select: {
                Profile: {
                  select: {
                    username: true,
                    profile_image_uri: true,
                  },
                },
              },
            },
            _count: { select: { Likes: true } },
          },
        },
      },
    });
  }

  async GetStarredPostsById(user_id: number, limit: number, offset: number) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await this.GetStarredPostsById_(user_id, limit, offset);
        let post_ids: bigint[] = [];
        res.forEach((post: any) => post_ids.push(BigInt(post.post_id)));
        const Metadata: EFeedMeta = await this.GetPostMetadata(
          post_ids,
          user_id
        );
        const posts: EFeedItem[] = formatFavResponse(res);
        const finalPosts: EPostFinal[] = detailsMixers(posts, Metadata);
        resolve(finalPosts);
      } catch (err) {
        reject(err);
      }
    });
  }
}
