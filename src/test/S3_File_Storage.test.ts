import { IFileStorage } from "../pkg/file_storage/file_storage";
import { LocalFileStorage } from "../pkg/file_storage/local_file_storage";
import { S3FileStorage } from "../pkg/file_storage/s3_file_storage";
import { RandomString } from "../util/random";
require("dotenv").config();

let fileStorage: IFileStorage;
beforeAll(async () => {
  fileStorage = new S3FileStorage(
    (process.env as any).S3_BUCKET,
    (process.env as any).ACCESS_KEY_ID,
    (process.env as any).ACCESS_KEY_SECRET,
    (process.env as any).S3_REGION
  );
});

afterAll(async () => {});
jest.setTimeout(20000);
test("test all do", async () => {
  try {
    const localFileStorage = new LocalFileStorage();
    const imageFile = await localFileStorage.Get("./test_image.webp");

    const filePath = RandomString(10) + ".webp";
    await fileStorage.Put(filePath, imageFile);

    let ifFileExists = await fileStorage.IfFileExists(filePath);
    expect(ifFileExists).toBe(true);

    await fileStorage.Delete(filePath);
    ifFileExists = await fileStorage.IfFileExists(filePath);
    expect(ifFileExists).toBe(false);
  } catch (err) {
    expect(err).toBe(null);
  }
});
