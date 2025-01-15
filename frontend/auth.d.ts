import { IUser } from "@/interfaces/user";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session extends DefaultSession {
      accessToken?: string;
      accessType?:string;
      expired_at?:number;
      user:IUser;
    }
}
