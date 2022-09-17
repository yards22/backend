export interface IFileStorage {
  Put(filePath: string, fileData: any): Promise<void>;
  Get(filePath: string): Promise<Buffer>;
  Delete(filePath: string): Promise<void>;
  IfFileExists(filePath: string): Promise<boolean>;
}
