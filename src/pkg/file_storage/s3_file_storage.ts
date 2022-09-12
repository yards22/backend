import { IFileStorage } from "./file_storage";
import { readFile, writeFile, unlink, access } from "fs";
import { S3, Credentials } from "aws-sdk";

export class S3FileStorage implements IFileStorage {
  defaultBucket: string;
  private s3Client: S3;
  constructor(
    bucket: string,
    accessKeyId: string,
    accessKeySecret: string,
    region: string
  ) {
    this.defaultBucket = bucket;
    this.s3Client = new S3({
      credentials: new Credentials({
        accessKeyId: accessKeyId,
        secretAccessKey: accessKeySecret,
      }),
      region,
    });
  }
  Put(filePath: string, fileData: any, bucket?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.s3Client.putObject(
        {
          Bucket: bucket || this.defaultBucket,
          Key: filePath,
          Body: fileData,
        },
        (err) => {
          if (err != null) return reject(err);
          return resolve();
        }
      );
    });
  }
  Get(filePath: string, bucket?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.s3Client.getObject(
        {
          Bucket: bucket || this.defaultBucket,
          Key: filePath,
        },
        (err, data) => {
          if (err != null) {
            return reject(err);
          }
          return resolve(data.Body);
        }
      );
    });
  }
  Delete(filePath: string, bucket?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.s3Client.deleteObject(
        { Bucket: bucket || this.defaultBucket, Key: filePath },
        (err, data) => {
          if (err !== null) {
            return reject(err);
          }
          return resolve();
        }
      );
    });
  }
  IfFileExists(filePath: string, bucket?: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.s3Client.headObject(
        { Bucket: bucket || this.defaultBucket, Key: filePath },
        (err, data) => {
          if (err !== null) return resolve(false);
          return resolve(true);
        }
      );
    });
  }
}
