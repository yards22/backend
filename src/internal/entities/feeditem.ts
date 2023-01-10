export default interface EFeeditem {
        user_id : number;
        post_id : bigint;
        content : string|null;
        media : string|null;
        original_id : bigint|null;
        username : string;
        profile_pic_ref:string;
        likes :number;
        created_at :Date;
        updated_at:Date;
}