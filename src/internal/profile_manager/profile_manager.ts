import { PrismaClient } from "@prisma/client";


export default class ProfileManager {
    private store: PrismaClient;
    constructor(store:PrismaClient) {
        this.store = store;
    }

    GetUserById(
        userId: bigint
    ):Promise<any> {
        return this.store.profile.findUnique({ 
            where: { 
                user_id: userId
            },
            include: {
                Interests: true,
            },
        });
    }
    UpdateProfile(
        userId: bigint,
        profileImage: string,
        bio: string
    ):Promise<any> {
        return this.store.profile.update({
            where: {
                user_id: userId
            },
            data: {
                profile_image: profileImage,
                bio: bio
            }
        })
    }
    CreateProfile(
        userId:bigint,
        userName:string,
        emailId:string,
        profileImage:string,
        registeredDate:Date,
        bio:string,
        cricIndex:bigint
    ):Promise<any> {
        return this.store.profile.create({
            data: {
                user_id: userId,
                username: userName,
                email_id: emailId,
                profile_image: profileImage,
                registered_date: registeredDate,
                bio: bio,
                cric_index: cricIndex
            }
        })
    }
}