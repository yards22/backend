import { IImageResolver } from "./image_resolver";
import sharp from "sharp";

export class ImageResolver extends IImageResolver {
  Convert(
    imageFile: Buffer,
    size?: { h: number; w: number },
    format?: "webp" | "png" | "jpg" | "jpeg" | "pdf"
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const useSize = size ? size : this.defaultSize;
      sharp(imageFile)
        .resize(useSize.w, useSize.h)
        .toFormat(format || this.defaultFormat)
        .toBuffer()
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    });
  }
  async Metadata(imageFile: Buffer) {
    return new Promise((resolve, reject) => {
      sharp(imageFile)
        .metadata()
        .then((data) =>
          resolve({
            height: data.height,
            width: data.width,
            format: data.format,
            bufferSize: data.size,
          })
        )
        .catch((err) => reject(err));
    });
  }
}
