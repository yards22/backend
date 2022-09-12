import { IFileStorage } from "../pkg/file_storage/file_storage";
import { LocalFileStorage } from "../pkg/file_storage/local_file_storage";
import { RandomString } from "../util/random";
let fileStorage: IFileStorage;
beforeAll(async () => {
  fileStorage = new LocalFileStorage();
});

afterAll(async () => {});

test("test create notification", async () => {
  try {
    const filePath = `${RandomString(10)}.txt`;
    const data = RandomString(100);

    await fileStorage.Put(filePath, data);

    let ifFileExists = await fileStorage.IfFileExists(filePath);
    expect(ifFileExists).toBe(true);

    const gotFile = await fileStorage.Get(filePath);
    expect(gotFile.toString()).toBe(data);

    await fileStorage.Delete(filePath);

    ifFileExists = await fileStorage.IfFileExists(filePath);
    expect(ifFileExists).toBe(false);
  } catch (err) {
    expect(err).toBe(null);
  }
});
