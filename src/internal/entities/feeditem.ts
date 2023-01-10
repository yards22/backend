import { bool } from "aws-sdk/clients/signer";

export interface EFeeditem {
        user_id : number;
        post_id : bigint;
        content : string|null;
        media : string[]|null;
        original_id : bigint|null;
        username : string;
        profile_pic_ref:string;
        likes :number;
        created_at :Date;
        updated_at:Date;
}
interface ILikedData {
        postId: bigint;
        likeStatus: bool;
}
interface IFavouriteData {
        postId: bigint;
        favouriteStatus: bool;
}

interface ILikedUsers {
        postId: bigint;
        username: string[];
}

export interface EFeedMeta {
        isLiked : ILikedData[];
        isFavourite:IFavouriteData[];
        likedUsers:ILikedUsers[];
}

export interface EPostFinal {
        user_id : number;
        post_id : bigint;
        content : string|null;
        media : string[]|null;
        original_id : bigint|null;
        username : string;
        profile_pic_ref:string;
        likes :number;
        created_at :Date;
        updated_at:Date;
        isLiked : ILikedData[];
        isFavourite:IFavouriteData[];
        likedUsers:ILikedUsers[];
}
