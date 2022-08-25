import { Prisma, PrismaClient, Users } from "@prisma/client";
import EAuth from "../entities/auth";

export default class AuthManager{
    private store;
    constructor(store: PrismaClient){
        this.store = store;
    }

    CreateUser(mail_id: string, password: string): Promise<EAuth|null>{
        return this.store.users.create({ data:{mail_id,password}});
    }

    getUser(mail_id: string): Promise<EAuth|null>{
        return this.store.users.findFirst({
            where:{
                mail_id 
            }
        });
   }

}