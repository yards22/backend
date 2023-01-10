import {EFeedMeta, EFeeditem, EPostFinal} from "../internal/entities/feeditem";

const baseUrlForProfilePic = ""

export function detailsMixers(firstPart:EFeeditem[],secondPart:EFeedMeta){

      const postMap = new Map();
      const post_ids = firstPart.map((item) => {
        item.media = (item.media as any[]).map((m) => {
          return baseUrlForProfilePic + m;
        });
        postMap.set(Number(item.post_id), item);
        return Number(item.post_id);
      });

      // now combine both first and second part
      secondPart.isLiked.forEach((item) => {
        const postFromMap = postMap.get(Number(item.postId));
        postFromMap.is_liked = item.likeStatus;
        postMap.set(item.postId, postFromMap);
      });
      secondPart.isFavourite.forEach((item) => {
        const postFromMap = postMap.get(Number(item.postId));
        postFromMap.is_favorite = item.favouriteStatus;
        postMap.set(item.postId, postFromMap);
      });
      secondPart.likedUsers.forEach((item) => {
        const postFromMap = postMap.get(Number(item.postId));
        postFromMap.liked_by = item.username;
        postMap.set(item.postId, postFromMap);
      });

      const finalPosts: EPostFinal[] = [];
      postMap.forEach((v) => {
        finalPosts.push({
          ...v,
          created_at: new Date(v.created_at),
          updated_at: new Date(v.updated_at),
          profile_pic_ref: v.profile_pic_ref
            ? baseUrlForProfilePic + v.profile_pic_ref
            : null,
        });
      });
      return finalPosts;
}