export interface IKVStore {
  Set: (key: string, value: string, expiryTime?: number) => Promise<void>;
  Get: (key: string) => Promise<string | null>;
  Delete: (key: string) => Promise<void>;
  LPush:(key:string,value:string)=>Promise<void>;
  RPush:(key:string,value:string)=>Promise<void>;
  LPop:(key:string)=>Promise<string|null>;
  RPop:(key:string)=>Promise<string|null>;
  Truncate: () => Promise<void>;
  Close: () => Promise<void>;
}
