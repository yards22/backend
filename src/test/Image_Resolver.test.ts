import { IFileStorage } from "../pkg/file_storage/file_storage";
import { LocalFileStorage } from "../pkg/file_storage/local_file_storage";
import { IImageResolver } from "../pkg/image_resolver/image_resolver";
import { ImageResolver } from "../pkg/image_resolver/image_resolver_";
let imageResolver: IImageResolver;
beforeAll(async () => {
  imageResolver = new ImageResolver({ h: 320, w: 500 }, "jpeg");
});

afterAll(async () => {});

test("test create notification", async () => {
  try {
    const fileStorage = new LocalFileStorage();
    const image = await fileStorage.Get("./test_image.webp");
    const convertedImage = await imageResolver.Convert(image);
    await fileStorage.Put("./converted_test_image.jpeg", convertedImage);

    await fileStorage.Delete("./converted_test_image.jpeg");
  } catch (err) {
    expect(err).toBe(null);
  }
});
