import { IFileStorage } from "../file_storage/file_storage";

export abstract class IImageResolver {
  fileStorage: IFileStorage;
  defaultSize: { h: number; w: number };
  defaultFormat: "webp" | "png" | "jpg" | "jpeg" | "pdf";
  constructor(
    fileStorage: IFileStorage,
    size: { h: number; w: number },
    format: "webp" | "png" | "jpg" | "jpeg" | "pdf"
  ) {
    this.fileStorage = fileStorage;
    this.defaultSize = size;
    this.defaultFormat = format;
  }
  abstract Convert(
    imageFile: Buffer,
    size?: { h: number; w: number },
    format?: "webp" | "png" | "jpg" | "jpeg" | "pdf"
  ): Promise<Buffer>;
}
