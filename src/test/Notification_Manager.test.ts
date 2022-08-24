import { RandomString } from "../util/random";
import { Prisma, PrismaClient } from "@prisma/client";
import NotificationManager from "../internal/notification_manager/notification_manager";
let db: PrismaClient;
let nm: NotificationManager;
beforeAll(async () => {
  db = new PrismaClient();
  let i = 0;
  try {
    await db.$connect();
    nm = new NotificationManager(db);
    console.log("connected to db...");
  } catch (err) {
    throw err;
  }
});

afterAll(async () => {
  db.$disconnect();
  console.log("closed db...");
});

async function createRandomUser(): Promise<bigint> {
  try {
    const i = await db.users.create({
      data: {},
    });

    expect(i.id).not.toBe(null);
    expect(i.created_at).not.toBe(null);
    expect(Date.now() - i.created_at.getTime()).toBeLessThan(100);
    return i.id;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function createRandomNotification(forId: bigint) {
  try {
    const i = await nm.Create(forId, { type: "Like" });

    expect(i.id).not.toBe(null);
    expect(i.for_id).toBe(forId);
    expect(i.created_at).not.toBe(null);
    expect(Date.now() - i.created_at.getTime()).toBeLessThan(100);

    expect(i.status).toBe("Unseen");
    const metadata = i.metadata as Prisma.JsonObject;
    console.log(metadata.type);

    return i;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

test("test create notification", async () => {
  try {
    const forId = await createRandomUser();
    const i = await createRandomNotification(forId);
    expect(i).not.toBe(undefined);
  } catch (err) {
    expect(err).toBe(null);
  }
});
