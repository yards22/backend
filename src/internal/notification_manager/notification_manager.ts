import { PrismaClient } from "@prisma/client";
import ENotification from "../entities/notification";
import { ENotificationStatus } from "./types";

export default class NotificationManager {
  private store: PrismaClient;
  constructor(store: PrismaClient) {
    this.store = store;
  }

  async LikePost(creatorOfPost: number, whoLiked: number, postId: bigint) {
    return this.store.notifications.create({
      data: {
        for_id: creatorOfPost,
        entity: "post",
        status: "Unseen",
        triggered_by_id: whoLiked,
        type: "LIKE",
        entity_identifier: postId.toString(),
      },
    });
  }

  async UnLikePost(whoUnLiked: number, postId: bigint) {
    return this.store.notifications.deleteMany({
      where: {
        entity: "post",
        triggered_by_id: whoUnLiked,
        type: "LIKE",
        entity_identifier: postId.toString(),
      },
    });
  }

  async CommentPost(
    creatorOfPost: number,
    whoCommented: number,
    postId: bigint
  ) {
    return this.store.notifications.create({
      data: {
        for_id: creatorOfPost,
        entity: "post",
        status: "Unseen",
        triggered_by_id: whoCommented,
        type: "COMMENT",
        entity_identifier: postId.toString(),
      },
    });
  }

  async Follow(whoIsBeingFollowed: number, whoFollowed: number) {
    return this.store.notifications.create({
      data: {
        for_id: whoIsBeingFollowed,
        entity: "FOLLOW",
        status: "Unseen",
        triggered_by_id: whoFollowed,
        type: "FOLLOW",
      },
    });
  }

  async UnFollow(whoIsBeingUnFollowed: number, whoUnFollowed: number) {
    return this.store.notifications.deleteMany({
      where: {
        for_id: whoIsBeingUnFollowed,
        entity: "FOLLOW",
        triggered_by_id: whoUnFollowed,
        type: "FOLLOW",
      },
    });
  }

  // Returns notification by notification id
  GetByID(id: bigint): Promise<ENotification | null> {
    return this.store.notifications.findUnique({ where: { id: id } });
  }

  // Returns notification by notification_id and for_id
  GetByIDAndForID(forId: number, id: bigint): Promise<ENotification | null> {
    return this.store.notifications.findFirst({
      where: { AND: [{ for_id: forId, id: id }] },
    });
  }

  // Returns notifications for a user
  GetManyByForID(
    forId: number,
    status: ENotificationStatus | "All",
    limit: number = 10,
    offset: number = 0
  ): Promise<ENotification[]> {
    return this.store.notifications.findMany({
      take: limit,
      skip: offset,
      where: {
        AND: [
          { for_id: { equals: forId } },
          status !== "All" ? { status: status } : {},
        ],
      },
    });
  }

  // Marks array of notifications for a user as "Read"
  async UpdateStatus(
    forId: number,
    ids: bigint[],
    status: ENotificationStatus
  ): Promise<void> {
    try {
      await this.store.notifications.updateMany({
        where: { AND: [{ for_id: forId }, { id: { in: ids } }] },
        data: {
          status,
        },
      });
      return;
    } catch (err) {
      throw err;
    }
  }
}
