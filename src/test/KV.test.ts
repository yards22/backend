import { DB } from "../DB/DB.DB";
import { IKVStore } from "../DB/DB.KV";
import ConnectToDB from "../Helpers/Connectors/ConnectDB";
import { RandomString } from "../util/random";
import InMKV from "../pkg/kv_store/kv_store_";
import NewV4UUID from "../Helpers/Wrapper/UUID";
import { Conf } from "../HTTP/ConfigInit";
let kv: IKVStore;
beforeAll(async () => {
  kv = new InMKV();
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
