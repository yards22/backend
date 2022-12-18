import { PrismaClient } from "@prisma/client";
import { IKVStore } from "../../pkg/kv_store/kv_store";
import NotificationManager from "../notification_manager/notification_manager";
import { LikeNotification } from "../notification_manager/types";

export default class LikeManager {
  private store: PrismaClient;
  private cache: IKVStore;
  private notificationManager: NotificationManager;
  constructor(
    store: PrismaClient,
    cache: IKVStore,
    notificationManager: NotificationManager
  ) {
    this.store = store;
    this.cache = cache;
    this.notificationManager = notificationManager;
  }

  async GetLikesCount(post_id: bigint) {
    return this.store.likes.count({ where: { post_id } });
  }

  async GetLikesForPost(post_id: bigint, limit: number, offset: number) {
    try {
      const _likes = await this.store.likes.findMany({
        where: { post_id },
        take: limit,
        skip: offset,
        include: {
          user: {
            select: {
              Profile: {
                select: {
                  username: true,
                  profile_image_uri: true,
                  user_id: true,
                },
              },
            },
          },
        },
      });

      // transforming data
      const likes: {
        create_at: Date;
        username: string;
        profile_pic_uri: string | null;
        user_id: number;
        type: number;
      }[] = [];
      _likes.forEach((item, index) => {
        if (item.user.Profile?.username)
          likes.push({
            create_at: item.created_at,
            username: item.user.Profile.username,
            type: item.type,
            profile_pic_uri: item.user.Profile.profile_image_uri,
            user_id: item.user.Profile.user_id,
          });
      });

      return likes;
    } catch (err) {
      throw err;
    }
  }

  // updates the like type or creates one
  async Like(post_id: bigint, user_id: number, type: number) {
    await this.store.likes.upsert({
      where: { user_id_post_id: { post_id, user_id } },
      update: { type },
      create: { type, user_id, post_id },
    });

    const creator = await this.store.posts.findUnique({ where: { post_id } });
    if (creator)
      this.notificationManager.Create(
        creator.user_id,
        new LikeNotification(post_id, user_id)
      );
  }

  async Unlike(post_id: bigint, user_id: number) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.store.likes.delete({
          where: { user_id_post_id: { user_id, post_id } },
        });
        resolve("Succesful_deletetion");
      } catch (err) {
        reject(err);
      }
    });
  }
}
