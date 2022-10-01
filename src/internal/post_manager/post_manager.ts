import { PrismaClient } from "@prisma/client";
import { IFileStorage } from "../../pkg/file_storage/file_storage";
import { ImageResolver } from "../../pkg/image_resolver/image_resolver_";
import { IKVStore } from "../../pkg/kv_store/kv_store";
const ALLOWED_IMAGES = 3;
const MAX_WIDTH = 1080;
export default class PostManager {
  private store: PrismaClient;
  private imageStorage: IFileStorage;
  private imageResolver: ImageResolver;
  private cache: IKVStore;
  constructor(
    store: PrismaClient,
    imageResolver: ImageResolver,
    imageStorage: IFileStorage,
    cache: IKVStore
  ) {
    this.store = store;
    this.imageStorage = imageStorage;
    this.imageResolver = imageResolver;
    this.cache = cache;
  }

  GetByID(
    id: number,
    limit: number,
    offset: number,
    includeLikeCount: boolean
  ) {
    return this.store.posts.findMany({
      where: { user_id: id },
      include: { _count: { select: { Likes: includeLikeCount } } },
      skip: offset,
      take: limit,
    });
  }

  async Create(user_id: number, content: string, medias: Buffer[]) {
    try {
      const post = await this.store.posts.create({
        data: {
          content,
          user_id: user_id,
          media: JSON.stringify([]),
        },
      });

      try {
        await this.UploadMedias(user_id, post.post_id, medias);
      } catch (err) {
        // image upload failed, rollback: delete post
        try {
          await this.Delete(user_id, post.post_id);
        } catch (err) {
          throw err;
        }
        throw err;
      }
    } catch (err) {
      throw err;
    }
  }

  Update(user_id: number, post_id: bigint, content?: string) {
    return this.store.posts.update({
      data: { content },
      where: { user_id_post_id: { post_id: post_id, user_id: user_id } },
    });
  }

  async Delete(user_id: number, post_id: bigint) {
    await this.store.posts.deleteMany({
      where: { AND: { user_id, post_id } },
    });
  }

  Share(user_id: number, original_id: number, content: string) {
    return this.store.posts.create({
      data: { content, user_id: user_id, original_id },
    });
  }

  async UpdateMediaRef(
    user_id: number,
    post_id: bigint,
    added: string[],
    removed: string[]
  ) {
    try {
      const currentImagesRef = await this.store.posts.findUnique({
        where: { user_id_post_id: { post_id, user_id } },
      });
      if (!currentImagesRef) throw new Error("post not found");

      let updatedMediaRef =
        currentImagesRef.media !== null
          ? (JSON.parse(currentImagesRef.media) as string[])
          : [];

      // removing removed images from db array
      updatedMediaRef = updatedMediaRef.filter((item) => {
        if (removed.includes(item)) return false;
        return true;
      });

      // adding the new images to the db array
      added.forEach((item) => {
        if (!updatedMediaRef.includes(item)) updatedMediaRef.push(item);
      });

      // updating the database
      try {
        await this.store.posts.update({
          data: { media: JSON.stringify(updatedMediaRef) },
          where: { user_id_post_id: { user_id, post_id } },
        });
      } catch (err) {
        throw err;
      }
    } catch (err) {
      throw err;
    }
  }

  async UploadMedias(user_id: number, post_id: bigint, medias: Buffer[]) {
    const mediaRef = medias.map((_, index) => {
      return `media_${post_id}_${index}.${this.imageResolver.defaultFormat}`;
    });

    for (let i = 0; i < ALLOWED_IMAGES; i++) {
      const imagesMetadata = await this.imageResolver.Metadata(medias[i]);

      // considering max width check
      let imageWidth = imagesMetadata.width || 1080;
      if (imageWidth > MAX_WIDTH) imageWidth = MAX_WIDTH;

      try {
        // uploading image
        await this.imageStorage.Put(
          mediaRef[i],

          // converting image
          await this.imageResolver.Convert(medias[i], { w: imageWidth })
        );
      } catch (err) {
        // media upload failed
        throw err;
      }
    }
    // -----------------media upload completed----------------

    // updating db
    try {
      await this.UpdateMediaRef(user_id, post_id, mediaRef, []);
    } catch (err) {
      // updating media ref in db failed: delete images from storage
      try {
        for (let i = 0; i < ALLOWED_IMAGES; i++) {
          await this.imageStorage.Delete(
            `media_${post_id}_${i}.${this.imageResolver.defaultFormat}`
          );
        }
      } catch (err) {
        throw err;
      }
      throw err;
    }
  }
}
