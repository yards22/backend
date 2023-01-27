import { PrismaClient } from "@prisma/client";
import { IKVStore } from "../../pkg/kv_store/kv_store";
import NotificationManager from "../notification_manager/notification_manager";
export default class CommentManager {
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

  async GetCommentsCount(post_id: bigint) {
    return this.store.parentComments.count({ where: { post_id } });
  }

  async GetCommentsForPost(post_id: bigint, limit: number, offset: number) {
    try {
      const _comments = await this.store.parentComments.findMany({
        where: { post_id },
        take: limit,
        skip: offset,
        include: {
          user: {
            select: {
              Profile: {
                select: {
                  username: true,
                  user_id: true,
                  profile_image_uri: true,
                },
              },
            },
          },
          ChildComments: {
            select: {
              comment_id: true,
              content: true,
              created_at: true,
              user: {
                select: {
                  Profile: {
                    select: {
                      username: true,
                      user_id: true,
                      profile_image_uri: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      // transforming data
      const comments: {
        comment_id: bigint;
        username: string;
        user_id: number;
        profile_image_uri: string | null;
        content: string;
        replies: {
          reply_id: bigint,
          created_at: Date;
          username: string;
          content: string;
          user_id: number;
          profile_image_uri: string | null;
        }[];
        created_at: Date;
      }[] = [];
      _comments.forEach((item, index) => {
        if (item.user.Profile?.username)
          comments.push({
            comment_id: item.comment_id,

            username: item.user.Profile.username,
            user_id: item.user.Profile.user_id,
            profile_image_uri: item.user.Profile.profile_image_uri,

            content: item.content,
            replies: item.ChildComments.map((repItem, repIndex) => {
              return {
                reply_id: repItem.comment_id,
                content: repItem.content,
                created_at: repItem.created_at,
                username: repItem.user.Profile?.username || "",
                user_id: repItem.user.Profile?.user_id || 0,
                profile_image_uri:
                  repItem.user.Profile?.profile_image_uri || "",
              };
            }),
            created_at: item.created_at,
          });
      });

      return comments;
    } catch (err) {
      throw err;
    }
  }

  async Comment(post_id: bigint, user_id: number, content: string) {
    const comment = await this.store.parentComments.create({
      data: { content, user_id, post_id },
    });

    const creator = await this.store.posts.findUnique({ where: { post_id } });
    if (creator && creator.user_id !== user_id)
      this.notificationManager.CommentPost(creator.user_id, user_id, post_id);
    return comment;
  }

  async DeleteComment(post_id: bigint, user_id: number, comment_id: bigint) {
    return await this.store.parentComments.deleteMany({
      where: { AND: { post_id, user_id, comment_id } },
    });
  }

  async Reply(parent_comment_id: bigint, user_id: number, content: string) {
    const reply = await this.store.childComments.create({
      data: { content, user_id, parent_comment_id },
      include: {
        parentComment: {
          include: {
            user: { select: { user_id: true } },
            post: {
              select: {
                post_id: true,
              },
            },
          },
        },
      },
    });

    if (reply.parentComment.user.user_id !== user_id)
      this.notificationManager.ReplyComment(
        reply.parentComment.user.user_id,
        user_id,
        reply.parentComment.post.post_id
      );
    return reply;
  }

  async DeleteReply(
    parent_comment_id: bigint,
    user_id: number,
    comment_id: bigint
  ) {
    return this.store.childComments.deleteMany({
      where: { AND: { comment_id, parent_comment_id, user_id } },
    });
  }
}
