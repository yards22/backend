import { IKVStore } from "./kv_store";

class InMKV implements IKVStore {
  store: Map<string, string | null>;
  constructor() {
    this.store = new Map<string, string | null>();
  }
  Set(key: string, value: string, expiryTime?: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.store.set(key, value);
      return resolve();
    });
  }
  Get(key: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      const v = this.store.get(key);
      if (v) {
        return resolve(v);
      }
      return resolve(null);
    });
  }
  Delete(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.store.delete(key);
      return resolve();
    });
  }
  Truncate(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.store = new Map<string, string | null>();
      return resolve();
    });
  }
  Close() {}
}

export default InMKV;
