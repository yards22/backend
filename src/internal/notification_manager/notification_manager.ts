import { PrismaClient } from "@prisma/client";
import ENotification from "../entities/notification";
import { ENotificationStatus } from "./types";

export default class NotificationManager {
  private store: PrismaClient;
  constructor(store: PrismaClient) {
    this.store = store;
  }

  // TODO: Do not accept any metadata, need to accept different types according to Notification Type
  async Create(forId: number, metadata: any): Promise<ENotification> {
    return this.store.notifications.create({
      data: { for_id: forId, status: "Unseen", metadata: metadata },
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
