import { PrismaClient } from "@prisma/client";
import EProfile from "../entities/profile";

export default class ProfileManager {
  private store: PrismaClient;
  constructor(store: PrismaClient) {
    this.store = store;
  }

  async IfUserNameExists(username: string): Promise<boolean> {
    const profile = await this.store.profile.findFirst({
      where: {
        username,
      },
    });
    if (profile !== null && profile.username === username) {
      // username already exists
      return true;
    }
    return false;
  }

  GetUserById(userId: bigint): Promise<EProfile | null> {
    return this.store.profile.findUnique({
      where: {
        user_id: userId,
      },
      include: {
        user: {
          include: { Interests: true },
        },
      },
    });
  }

  // accepting profileImageUri or bio as optional so as any one can also be updated at once
  UpdateProfile(
    userId: bigint,
    profileImageUri?: string,
    bio?: string
  ): Promise<EProfile> {
    return this.store.profile.update({
      where: {
        user_id: userId,
      },
      data: {
        profile_image_uri: profileImageUri,
        bio: bio,
      },
    });
  }

  // TODO: Handle image upload and then take profile image uri
  CreateProfile(
    userId: bigint,
    userName: string,
    bio?: string,
    profileImageUri?: string,
    emailId?: string
  ): Promise<EProfile> {
    return this.store.profile.create({
      data: {
        user_id: userId,
        username: userName,
        email_id: emailId,
        profile_image_uri: profileImageUri,
        bio: bio,
      },
    });
  }
}
