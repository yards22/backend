import { Prisma, PrismaClient } from "@prisma/client";
import MiscManager from "../internal/misc_manager/misc_manager";
let db: PrismaClient;
beforeAll(async () => {
  db = new PrismaClient();
  try {
    await db.$connect();
    console.log("connected to db...");
  } catch (err) {
    throw err;
  }
});

afterAll(async () => {
  db.$disconnect();
  console.log("closed db...");
});

test("create polls", async () => {
  const args = [
    {
      poll_question: "Dhoni Vs Kohli Vs Sachin",
      options_count: 3,
      options: JSON.stringify(["Dhoni", "Kohli", "Sachin"]),
    },
    {
      poll_question: "Who will win match IND vs NZ?",
      options_count: 2,
      options: JSON.stringify(["IND", "NZ"]),
    },
    {
      poll_question: "Some Random Question",
      options_count: 4,
      options: JSON.stringify(["A", "B", "C", "D"]),
    },
  ];
  try {
    const i = await db.polls.createMany({
      data: args,
    });

    expect(i.count).toBe(3);
  } catch (err) {
    console.log(err);
    throw err;
  }
});
