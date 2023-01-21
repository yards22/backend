import { Prisma, PrismaClient } from "@prisma/client";
import { IFileStorage } from "../../pkg/file_storage/file_storage";
import { ImageResolver } from "../../pkg/image_resolver/image_resolver_";
import { HerrorStatus } from "../../pkg/herror/status_codes";
import { randomUUID } from "crypto";
import { Herror } from "../../pkg/herror/herror";

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

  receiveFeedback(
    user_id: number,
    content: string,
    rawImage?: Buffer
  ): Promise<{
    responseStatus: IResponse;
  }> {
    return new Promise(async (resolve, reject) => {
      try {
        let filePath: string | undefined = undefined;

        // checking if we have file
        if (rawImage) {
          const format = "jpg";
          filePath = randomUUID() + "_fb." + format;
          let resolvedImage = await this.imageResolver.Convert(
            rawImage,
            { h: 320, w: 512 },
            format
          );
          await this.imageStorage.Put(filePath, resolvedImage);
        }
        await this.store.feedback.create({
          data: {
            content,
            user_id: user_id,
            image_uri: filePath,
          },
        });
        resolve({
          responseStatus: {
            statusCode: HerrorStatus.StatusCreated,
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

  async GetPolls(user_id: number, limit: number, offset: number) {
    const pollData = await this.store.polls.findMany({
      take: limit,
      skip: offset,
      include: {
        PollsReaction: {
          select: {
            user_id: true,
            type: true,
            poll_id: true,
          },
        },
      },
      orderBy: [
        {
          created_at: "desc",
        },
      ],
    });

    const res: {
      poll: {
        poll_id: number;
        poll_question: string;
        options: string[];
      };
      hasPolled: boolean;
      reaction: { type: number; count: number }[];
    }[] = [];

    pollData.forEach((item) => {
      const temp: {
        poll: {
          poll_id: number;
          poll_question: string;
          options: string[];
        };
        hasPolled: boolean;
        reaction: { type: number; count: number }[];
      } = {
        poll: {
          poll_id: item.poll_id,
          poll_question: item.poll_question as string,
          options: JSON.parse(item.options),
        },
        hasPolled: false,
        reaction: [],
      };

      const reactionMap = new Map<number, number>();
      item.PollsReaction.forEach((pr) => {
        if (pr.user_id === user_id) temp.hasPolled = true;
        reactionMap.set(pr.type, reactionMap.get(pr.type) || 0 + 1);
      });
      reactionMap.forEach((v, k) => {
        temp.reaction.push({ type: k, count: v });
      });

      res.push(temp);
    });
    return res;
  }

  async PostPollReaction(poll_id: number, user_id: number, type: number) {
    try {
      await this.store.pollsReaction.create({
        data: {
          type,
          poll_id,
          user_id,
        },
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        throw new Herror(
          "cannot post reaction to this poll again",
          HerrorStatus.StatusMethodNotAllowed
        );
      }
      throw err;
    }
  }
}
