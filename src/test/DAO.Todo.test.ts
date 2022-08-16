import { RandomString } from "../util/random";
import { PrismaClient } from "@prisma/client";
let db: PrismaClient;

beforeAll(async () => {
  db = new PrismaClient();
  let i = 0;
  try {
    await db.$connect();
    console.log("connected to db...");
  } catch (err) {
    throw err;
  }
});

afterAll(async () => {
  db.$disconnect();
  console.log("Closed DB Connection");
});

async function createRandomTodo() {
  try {
    const title = RandomString(10);
    const description = RandomString(10);
    const i = await db.todos.create({
      data: {
        title,
        description,
      },
    });

    expect(i.id).not.toBe(null);
    expect(i.created_at).not.toBe(null);
    expect(Date.now() - i.created_at.getTime()).toBeLessThan(100);
    expect(i.description).toBe(description);
    expect(i.title).toBe(title);
    return i;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

test("test create todo item", async () => {
  try {
    const i = await createRandomTodo();
    expect(i).not.toBe(undefined);
  } catch (err) {
    expect(err).toBe(null);
  }
});
