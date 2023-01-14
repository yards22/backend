import { Herror } from "../../pkg/herror/herror";
import { HerrorStatus } from "../../pkg/herror/status_codes";
import RouteHandler from "./types";

//TODO: Perform proper error handling.

export const HandleCreatePost: RouteHandler = async (req, res, next, app) => {
  const user_id: number = Number(req.context.user_id);
  const content: string = req.body.content;
  const images = req.files as Array<any>;
  let image_buffer: Buffer[] = [];
  for (let i = 0; i < images?.length; i++) {
    image_buffer.push(images[i].buffer);
  }

  try {
    const post = await app.postManager.Create(user_id, image_buffer, content);
    app.SendRes(res, {
      status: 201,
      data: post,
    });
  } catch (err) {
    next(err);
  }
};

export const HandleUpdatePost: RouteHandler = async (req, res, next, app) => {
  const user_id: number = Number(req.context.user_id);
  const content: string = String(req.body.content);
  const post_id: bigint = BigInt(req.body.post_id);
  const removed_images: string = String(req.body.removed_images);
  const edits: number = Number(req.body.edits);
  const images = req.files as Array<any>;
  let image_buffer: Buffer[] = [];
  for (let i = 0; i < images?.length; i++) {
    image_buffer.push(images[i].buffer);
  }

  try {
    const updated_post = await app.postManager.Update(
      user_id,
      post_id,
      removed_images,
      image_buffer,
      edits,
      content
    );
    app.SendRes(res, {
      status: 200,
      data: updated_post,
    });
  } catch (err) {
    next(err);
  }
};

export const HandleDeletePost: RouteHandler = async (req, res, next, app) => {
  const user_id: number = Number(req.context.user_id);
  const post_id: bigint = BigInt(req.body.post_id);

  try {
    await app.postManager.Delete(user_id, post_id);
    app.SendRes(res, {
      status: 200,
      message: "post_deleted",
    });
  } catch (err) {
    next(err);
  }
};

export const HandleGetPosts: RouteHandler = async (req, res, next, app) => {
  const user_id: number = Number(req.context.user_id);
  const limit: number = Number(req.query.limit || 10);
  const offset: number = Number(req.query.offset || 0);
  const type: string = req.params.type;
  const username: string = req.query.username as string;
  try {
    if (type === "feed") {
      const posts = await app.postManager.GetUsersFeed(user_id, limit, offset);
      app.SendRes(res, {
        status: 200,
        data: posts,
      });
      return;
    }
    if (type === "trending") {
      const posts = await app.postManager.GetTrendingPosts(
        user_id,
        limit,
        offset
      );
      app.SendRes(res, {
        status: 200,
        data: posts,
      });
      return;
    }

    if (type === "mine") {
      const user_id_: number = Number(req.query.user_id || user_id);
      const userPosts = await app.postManager.GetUserPostsById(
        user_id_,
        limit,
        offset
      );
      app.SendRes(res, {
        status: HerrorStatus.StatusOK,
        data: userPosts,
      });
      return;
    }

    if (type === "fav") {
      const userPosts = await app.postManager.GetStarredPostsById(
        user_id,
        limit,
        offset
      );
      app.SendRes(res, {
        status: HerrorStatus.StatusOK,
        data: userPosts,
      });
      return;
    }
  } catch (err) {
    next(err);
  }
};

export const HandleShareToTimeline: RouteHandler = async (
  req,
  res,
  next,
  app
) => {
  const user_id: number = Number(req.context.user_id);
  const post_id: bigint = BigInt(req.body.post_id);
  const content: string = String(req.body.content);
  try {
    await app.postManager.ShareToTimeline(user_id, post_id, content);
    app.SendRes(res, {
      status: 200,
    });
  } catch (err) {
    next(err);
  }
};

export const HandleAddToFavourites: RouteHandler = async (
  req,
  res,
  next,
  app
) => {
  const user_id: number = Number(req.context.user_id);
  const post_id: bigint = BigInt(req.body.post_id);
  const is_fav = req.body.is_fav;

  if (post_id === undefined || post_id === null) {
    next(new Herror("post_id missing", HerrorStatus.StatusBadRequest));
  } else {
    try {
      if (is_fav) await app.postManager.createStarredPosts(user_id, post_id);
      else await app.postManager.deleteStarredPosts(user_id, post_id);
      app.SendRes(res, {
        status: 200,
      });
    } catch (err) {
      next(err);
    }
  }
};

export const HandlePostsMetaData: RouteHandler = async (
  req,
  res,
  next,
  app
) => {
  const user_id: number = Number(req.context.user_id);
  const post_ids = req.body.post_ids as bigint[];
  console.log(post_ids);
  try {
    const { isLiked, isFavourite, likedUsers } =
      await app.postManager.GetPostMetadata(post_ids, user_id);
    app.SendRes(res, {
      status: 200,
      data: { isLiked, isFavourite, likedUsers },
      message: "OK",
    });
  } catch (err) {
    next(err);
  }
};
