import { LocalFileStorage } from "../pkg/file_storage/local_file_storage";
import { S3FileStorage } from "../pkg/file_storage/s3_file_storage";
import { IImageResolver } from "../pkg/image_resolver/image_resolver";
import { ImageResolver } from "../pkg/image_resolver/image_resolver_";
require("dotenv").config();
let imageResolver: IImageResolver;
beforeAll(async () => {
  imageResolver = new ImageResolver({ h: 320, w: 500 }, "jpeg");
});

afterAll(async () => {});
jest.setTimeout(20000);
test("test create notification", async () => {
  try {
    const localFileStorage = new LocalFileStorage();
    const s3FileStorage = new S3FileStorage(
      (process.env as any).S3_BUCKET,
      (process.env as any).ACCESS_KEY_ID,
      (process.env as any).ACCESS_KEY_SECRET,
      (process.env as any).S3_REGION
    );
    const image = await localFileStorage.Get("./test_image.webp");
    const convertedImage = await imageResolver.Convert(image);
    await s3FileStorage.Put("converted_test_image.jpeg", convertedImage);
  } catch (err) {
    expect(err).toBe(null);
  }
});
