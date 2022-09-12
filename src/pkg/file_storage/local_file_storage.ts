import { IFileStorage } from "./file_storage";
import { readFile, writeFile, unlink, access } from "fs";
export class LocalFileStorage implements IFileStorage {
  Put(filePath: string, fileData: any): Promise<void> {
    return new Promise((resolve, reject) => {
      writeFile(filePath, fileData, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
  Get(filePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      readFile(filePath, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  }
  Delete(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      unlink(filePath, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
  IfFileExists(filePath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      access(filePath, (err) => {
        if (err) return resolve(false);
        resolve(true);
      });
    });
  }
}
