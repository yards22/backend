import { EFeedItem } from "../internal/entities/feeditem";
import { ENetworkItem } from "../internal/entities/networkitem";

export function formatTrendingFeedResponse(allPosts: any): EFeedItem[] {
  let posts_: EFeedItem[] = [];
  allPosts.forEach((x: any) => {
    let feed: EFeedItem = {
      user_id: x.post.user_id,
      post_id: x.post_id,
      content: x.post.content,
      media: JSON.parse(x.post.media),
      original_id: x.post.original_id,
      created_at: x.post.created_at,
      updated_at: x.post.updated_at,
      likes: x.post._count.Likes,
      username: x.post.user.Profile.username,
      profile_pic_ref: x.post.user.Profile.profile_image_uri,
    };
    posts_.push(feed);
  });
  return posts_;
}

export function formatFeedResponse(allPosts: any): EFeedItem[] {
  let posts_: EFeedItem[] = [];
  allPosts.forEach((x: any) => {
    let feed: EFeedItem = {
      user_id: x.user_id,
      post_id: x.post_id,
      content: x.content,
      media: JSON.parse(x.media),
      original_id: x.original_id,
      created_at: x.created_at,
      updated_at: x.updated_at,
      likes: x._count.Likes,
      comment_count : x._count.ParentComments,
      username: x.user.Profile.username,
      profile_pic_ref: x.user.Profile.profile_image_uri,
    };
    posts_.push(feed);
  });
  return posts_;
}

export function formatFavResponse(allPosts: any): EFeedItem[] {
  let posts_: EFeedItem[] = [];
  allPosts.forEach((x: any) => {
    let feed: EFeedItem = {
      user_id: x.post.user_id,
      post_id: x.post.post_id,
      content: x.post.content,
      media: JSON.parse(x.post.media),
      original_id: x.original_id,
      created_at: x.post.created_at,
      updated_at: x.post.updated_at,
      likes: x.post._count.Likes,
      username: x.post.user.Profile.username,
      profile_pic_ref: x.post.user.Profile.profile_image_uri,
    };
    posts_.push(feed);
  });
  return posts_;
}

export function formatFeedResponseUsername(
  allPosts: any,
  profile_image_uri: string,
  username: string
): EFeedItem[] {
  let posts_: EFeedItem[] = [];
  allPosts.forEach((x: any) => {
    let feed: EFeedItem = {
      user_id: x.user_id,
      post_id: x.post_id,
      content: x.content,
      media: JSON.parse(x.media),
      original_id: x.original_id,
      created_at: x.created_at,
      updated_at: x.updated_at,
      likes: x._count.Likes,
      username: username,
      profile_pic_ref: profile_image_uri,
    };
    posts_.push(feed);
  });
  return posts_;
}

export function formatNetworkResponseRecommended(
  networkDetails: any
): ENetworkItem {
  const networkItem_: ENetworkItem = {
    user_id: networkDetails.Profile.user_id,
    username: networkDetails.Profile.username,
    profile_image_uri: networkDetails.Profile.profile_image_uri,
    cric_index: networkDetails.Profile.cric_index,
  };
  return networkItem_;
}

export function formatNetworkResponseTrending(
  networkDetails: any
): ENetworkItem {
  const networkItem_: ENetworkItem = {
    user_id: networkDetails.user.Profile.user_id,
    username: networkDetails.user.Profile.username,
    profile_image_uri: networkDetails.user.Profile.profile_image_uri,
    cric_index: networkDetails.user.Profile.cric_index,
  };
  return networkItem_;
}
