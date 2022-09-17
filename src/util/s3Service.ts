import { S3FileStorage } from "../pkg/file_storage/s3_file_storage";
import { RandomString } from "./random";

export function s3Upload(files) {
  const fileStorage = new S3FileStorage(
    (process.env as any).S3_BUCKET,
    (process.env as any).ACCESS_KEY_ID,
    (process.env as any).ACCESS_KEY_SECRET,
    (process.env as any).S3_REGION
  );
  const filePath = RandomString(10) + ".webp";
  fileStorage.Put(filePath, files[0]);
}
