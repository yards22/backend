import { IKVStore } from "./kv_store";
import { createClient, RedisClientType } from "redis";
class Redis implements IKVStore {
  store: RedisClientType;
  constructor(store: RedisClientType) {
    this.store = store;
  }
  Set(key: string, value: string, expiryTime?: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.store
        .set(key, value, {
          EX: expiryTime,
        })
        .then(() => {
          return resolve();
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }
  Get(key: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      this.store
        .get(key)
        .then((v) => {
          return resolve(v);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }
  Delete(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.store
        .del(key)
        .then(() => {
          return resolve();
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }
  Truncate(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.store
        .flushDb()
        .then(() => {
          return resolve();
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }
  Close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.store.disconnect();
      return resolve();
    });
  }
}

export default Redis;
