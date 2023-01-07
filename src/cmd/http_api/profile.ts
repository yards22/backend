import { Herror } from "../../pkg/herror/herror";
import { HerrorStatus } from "../../pkg/herror/status_codes";
import RouteHandler from "./types";

export const HandleUpdateProfile: RouteHandler = async (req,res,next,app) => {
  const user_id: number = Number(req.context.user_id);
  const token: string = req.context.token;
  const bio: string = req.body.bio as string;
  let profile_buffer: Buffer | undefined = undefined;
  if (req.file && req.file.buffer) profile_buffer = req.file.buffer;

  const username: string = req.body.username;
  const interests: string = req.body.interests;

  const { responseStatus, profileData } =
    await app.profileManager.UpdateProfileDetails(
      user_id,
      username,
      token,
      profile_buffer,
      bio,
      interests
    );
  app.SendRes(res, {
    status: responseStatus.statusCode,
    data: profileData,
    message: responseStatus.message,
  });
};

export const HandleGetUserPrimaryInfo: RouteHandler = async (
  req,
  res,
  next,
  app
) => {
  const user_id = Number(req.context.user_id);
  console.log(user_id);
  if (user_id != undefined) {
    const userProfile = await app.profileManager.GetUserPrimaryInfoById(
      user_id
    );
    app.SendRes(res, {
      status: HerrorStatus.StatusOK,
      data: userProfile,
    });
  } else {
    next(new Herror("BadRequest", HerrorStatus.StatusBadRequest));
  }
};

export const HandleGetUserProfileInfo: RouteHandler = async (
  req,
  res,
  next,
  app
) => {
  var username :string 
  username = req.query.username as string 
  const user_id = Number(req.context.user_id);
  const limit = Number(req.query.limit || 10);
  const offset = Number(req.query.offset || 0);
  if (user_id != undefined) {
    if(username === undefined){
      const userProfile = await app.profileManager.GetUserProfileById(
        user_id,
        offset,
        limit
      );
      app.SendRes(res, {
        status: HerrorStatus.StatusOK,
        data: userProfile,
      });
    }
    else{
      const userProfile = await app.profileManager.GetUserByUsernameBulk(
        username,
        offset,
        limit
        );
      app.SendRes(res, {
        status: HerrorStatus.StatusOK,
        data: userProfile,
      });
    }

  } else {
    next(new Herror("BadRequest", HerrorStatus.StatusBadRequest));
  }
};

export const HandleGetUserPosts:RouteHandler =async (req,res,next,app)=>{
  var username :string 
  username = req.query.username as string ;
  console.log(username);
  const limit = Number(req.query.limit || 10);
  const offset = Number(req.query.offset || 0);
  const user_id = req.context.user_id;
  if (user_id != undefined) {
    if(username === undefined){
      const userProfile = await app.profileManager.GetUserPostsById(
        user_id,
        offset,
        limit
      );
      console.log(userProfile)
      app.SendRes(res, {
        status: HerrorStatus.StatusOK,
        data: userProfile,
      });
    }
    else{
      const userProfile = await app.profileManager.GetUserPostsByUsername(
        username,
        offset,
        limit
        );
      app.SendRes(res, {
        status: HerrorStatus.StatusOK,
        data: userProfile,
      });
    }

  } else {
    next(new Herror("BadRequest", HerrorStatus.StatusBadRequest));
  }
}

export const HandleGetUserStaredPosts:RouteHandler =async (req,res,next,app)=>{
  var username :string 
  username = req.query.username as string ;
  const limit = Number(req.query.limit || 10);
  const offset = Number(req.query.offset || 0);
  const user_id = req.context.user_id;
  if (user_id != undefined) {
    if(username === undefined){
      const userProfile = await app.profileManager.GetStaredPostsById(
        user_id,
        offset,
        limit
      );
      console.log(userProfile)
      app.SendRes(res, {
        status: HerrorStatus.StatusOK,
        data: userProfile,
      });
    }
    else{
      const userProfile = await app.profileManager.GetStaredPostsByUsername(
        username,
        offset,
        limit
        );
      app.SendRes(res, {
        status: HerrorStatus.StatusOK,
        data: userProfile,
      });
    }

  } else {
    next(new Herror("BadRequest", HerrorStatus.StatusBadRequest));
  }
}

export const HandleGetCheckUsername: RouteHandler = async (
  req,
  res,
  next,
  app
) => {
  const username = req.body.username;
  if (username != undefined) {
    try {
      const { responseStatus } = await app.profileManager.CheckUsername(
        username
      );
      app.SendRes(res, {
        status: responseStatus.statusCode,
        message: responseStatus.message,
      });
    } catch (err) {
      next(err);
    }
  } else {
    next(new Herror("BadRequest", HerrorStatus.StatusBadRequest));
  }
};

export const HandleGetLeaderBoard: RouteHandler = async (
  req,
  res,
  next,
  app
) => {
  const limit = Number(req.query.limit ?? 10);
  const offset = Number(req.query.offset ?? 0);
  try {
    const { responseStatus, leaderBoard } =
      await app.profileManager.GetCommunityLeaderBoard(limit, offset);
    app.SendRes(res, {
      status: responseStatus.statusCode,
      message: responseStatus.message,
      data: leaderBoard,
    });
  } catch (err) {
    next(err);
  }
};
