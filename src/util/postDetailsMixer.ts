import {
  EFeedMeta,
  EFeedItem,
  EPostFinal,
} from "../internal/entities/feeditem";

export function detailsMixers(firstPart: EFeedItem[], secondPart: EFeedMeta) {
  const postMap = new Map();
  firstPart.forEach((item) => {
    postMap.set(item.post_id, item);
  });

  // now combine both first and second part
  secondPart.isLiked.forEach((item) => {
    const postFromMap = postMap.get(item.postId);
    postFromMap.is_liked = item.likeStatus;
    postMap.set(item.postId, postFromMap);
  });
  secondPart.isFavourite.forEach((item) => {
    const postFromMap = postMap.get(item.postId);
    postFromMap.is_favorite = item.favouriteStatus;
    postMap.set(item.postId, postFromMap);
  });
  secondPart.likedUsers.forEach((item) => {
    const postFromMap = postMap.get(item.postId);
    postFromMap.liked_by = item.username;
    postMap.set(item.postId, postFromMap);
  });

  const finalPosts: EPostFinal[] = [];
  postMap.forEach((v) => {
    finalPosts.push(v);
  });
  return finalPosts;
}
