import { PrismaClient } from "@prisma/client";
import { IFileStorage } from "../../pkg/file_storage/file_storage";
import { ImageResolver } from "../../pkg/image_resolver/image_resolver_";
import { HerrorStatus } from "../../pkg/herror/status_codes";

interface IResponse {
  statusCode: number;
  message?: string;
}

export default class MiscManager {
  private store: PrismaClient;
  private imageStorage: IFileStorage;
  private imageResolver: ImageResolver;

  constructor(
    store: PrismaClient,
    imageResolver: ImageResolver,
    imageStorage: IFileStorage
  ) {
    this.store = store;
    this.imageStorage = imageStorage;
    this.imageResolver = imageResolver;
  }

  recieveFeedback(
    user_id: number,
    username: String,
    rawImage: Buffer,
    content: string
  ): Promise<{
    responseStatus: IResponse;
  }> {
    return new Promise(async (resolve, reject) => {
      try {
        const format = "jpg";
        const filePath = username + "_fb." + format;
        let resolvedImage = await this.imageResolver.Convert(
          rawImage,
          { h: 320, w: 512 },
          format
        );
        await this.imageStorage.Put(filePath, resolvedImage);
        await this.store.feedback.create({
          data: {
            content,
            user_id: user_id,
            image_uri: filePath,
          },
        });
        resolve({
          responseStatus: {
            statusCode: HerrorStatus.StatusOK,
            message: "feedback_received_successfully",
          },
        });
      } catch (err) {
        reject(err);
      }
    });
  }
  GetLeaderBoard(limit: number, offset: number) {
    return this.store.profile.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        cric_index: "desc",
      },
    });
  }
}
