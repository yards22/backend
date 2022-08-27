import { RandomString } from "../util/random";
import InMKV from "../pkg/kv_store/kv_store_";
import { IKVStore } from "../pkg/kv_store/kv_store";
import { createClient,RedisClientType } from "redis";
import Redis from "../pkg/kv_store/redis";
let kv: IKVStore;
beforeAll(async () => {
  const store: RedisClientType = createClient({
    url: `redis://localhost:6379`,
  });
  await store.connect();
  kv = new Redis(store);
});

afterAll(async () => {
  kv.Close();
  console.log("Closed KV DB Connection");
});

async function setRandomItem() {
  try {
    const arg = {
      key: RandomString(10),
      value: RandomString(15),
    };
    const i = await kv.Set(arg.key, arg.value);

    return arg;
  } catch (err) {
    throw err;
  }
}

test("test set kv pair", async () => {
  try {
    const i = await setRandomItem();
    expect(i).not.toBe(undefined);
  } catch (err) {
    expect(err).toBe(null);
  }
});

test("test get kv pair", async () => {
  try {
    const i = await setRandomItem();
    expect(i).not.toBe(undefined);

    const r = await kv.Get(i.key);
    expect(r).not.toBe(null);
    expect(i.value).toBe(r);
  } catch (err) {
    expect(err).toBe(null);
  }
});

test("test delete kv pair", async () => {
  try {
    const i = await setRandomItem();
    expect(i).not.toBe(undefined);

    await kv.Delete(i.key);

    const r = await kv.Get(i.key);
    expect(r).toBe(null);
  } catch (err) {
    expect(err).toBe(null);
  }
});

test("test truncate kv store", async () => {
  try {
    const i = await setRandomItem();
    expect(i).not.toBe(undefined);

    await kv.Truncate();

    const r = await kv.Get(i.key);
    expect(r).toBe(null);
  } catch (err) {
    expect(err).toBe(null);
  }
});
