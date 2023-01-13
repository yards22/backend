import { Herror } from "../../pkg/herror/herror";
import { HerrorStatus } from "../../pkg/herror/status_codes";
import RouteHandler from "./types";

export const HandleLikeAndUnlike: RouteHandler = async (
  req,
  res,
  next,
  app
) => {
  const user_id: number = Number(req.context.user_id);
  const _post_id = req.body.post_id;
  if (_post_id == "" || _post_id == undefined || _post_id == null) {
    return next(new Herror("post id missing", HerrorStatus.StatusBadRequest));
  }
  try {
    if (req.body.is_like) {
      await app.likeManager.Like(BigInt(_post_id), user_id, req.body.type || 1);
      app.SendRes(res, {
        status: HerrorStatus.StatusOK,
        message: "liked_succesfully",
      });
    } else {
      await app.likeManager.Unlike(BigInt(_post_id), user_id);
      app.SendRes(res, {
        status: HerrorStatus.StatusOK,
        message: "disliked_succesfully",
      });
    }
  } catch (err) {
    next(err);
  }
};

export const HandleGetLikesForPost: RouteHandler = async (
  req,
  res,
  next,
  app
) => {
  const _post_id = req.body.post_id;
  if (_post_id == "" || _post_id == undefined || _post_id == null) {
    return next(new Herror("post id missing", HerrorStatus.StatusBadRequest));
  }

  if (req.query.only_count) {
    try {
      const likes = await app.likeManager.GetLikesCount(BigInt(_post_id));
      app.SendRes(res, {
        status: HerrorStatus.StatusOK,
        data: { count: likes },
      });
    } catch (err) {
      next(err);
    }
    return;
  }

  // send detailed data
  const limit = Number(req.query.limit || 100);
  const offset = Number(req.query.offset || 0);
  try {
    const likes = await app.likeManager.GetLikesForPost(
      BigInt(_post_id),
      limit,
      offset
    );
    app.SendRes(res, { status: HerrorStatus.StatusOK, data: { likes } });
  } catch (err) {
    next(err);
  }
};
