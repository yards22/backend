import { Notifications } from "@prisma/client";

export default interface ENotification extends Notifications {
  metadata: any;
}
