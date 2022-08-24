export interface IKVStore {
  Set: (key: string, value: string, expiryTime?: number) => Promise<void>;
  Get: (key: string) => Promise<string | null>;
  Delete: (key: string) => Promise<void>;
  Truncate: () => Promise<void>;
  Close: () => Promise<void>;
}
