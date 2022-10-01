import { PrismaClient } from "@prisma/client";
import { IKVStore } from "../../pkg/kv_store/kv_store";

export default class CommentManager {
  private store: PrismaClient;
  private cache: IKVStore;
  constructor(store: PrismaClient, cache: IKVStore) {
    this.store = store;
    this.cache = cache;
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
          user: { select: { Profile: { select: { username: true } } } },
          ChildComments: {
            select: {
              comment_id: true,
              content: true,
              created_at: true,
              user: {
                select: {
                  Profile: { select: { username: true, user_id: true } },
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
        content: string;
        replies: {
          created_at: Date;
          username: string;
          content: string;
          user_id: number;
        }[];
        created_at: Date;
      }[] = [];
      _comments.forEach((item, index) => {
        if (item.user.Profile?.username)
          comments.push({
            comment_id: item.comment_id,

            username: item.user.Profile.username,
            user_id: item.user_id,

            content: item.content,
            replies: item.ChildComments.map((repItem, repIndex) => {
              return {
                content: repItem.content,
                created_at: repItem.created_at,
                username: repItem.user.Profile?.username || "",
                user_id: repItem.user.Profile?.user_id || 0,
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
    return this.store.parentComments.create({
      data: { content, user_id, post_id },
    });
  }

  async DeleteComment(post_id: bigint, user_id: number, comment_id: bigint) {
    return this.store.parentComments.deleteMany({
      where: { AND: { post_id, user_id, comment_id } },
    });
  }

  async Reply(parent_comment_id: bigint, user_id: number, content: string) {
    return await this.store.childComments.create({
      data: { content, user_id, parent_comment_id },
    });
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
