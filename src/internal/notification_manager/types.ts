import { NotificationStatus } from "@prisma/client";
import { ToJson } from "../../util/json";
export type ENotificationStatus = NotificationStatus;

export abstract class BaseNotification {
  type: string;
  constructor(type: string) {
    this.type = type;
  }
  abstract ToJson(): string;
}

export class LikeNotification extends BaseNotification {
  post_id: BigInt;
  by: number;
  constructor(post_id: BigInt, by: number) {
    super("LIKE");
    this.by = by;
    this.post_id = post_id;
  }
  ToJson(): string {
    return ToJson({
      post_id: this.post_id,
      type: this.type,
      by: this.by,
    });
  }
}
export class CommentNotification extends BaseNotification {
  post_id: BigInt;
  by: number;
  constructor(post_id: BigInt, by: number) {
    super("COMMENT");
    this.by = by;
    this.post_id = post_id;
  }
  ToJson(): string {
    return ToJson({
      post_id: this.post_id,
      type: this.type,
      by: this.by,
    });
  }
}
export class FollowNotification extends BaseNotification {
  by: number;
  constructor(by: number) {
    super("FOLLOW");
    this.by = by;
  }
  ToJson(): string {
    return ToJson({ type: this.type, by: this.by });
  }
}

export type NotificationMetadataType =
  | LikeNotification
  | CommentNotification
  | FollowNotification;
