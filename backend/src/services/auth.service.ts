import { Connection } from "@src/config/database"
import { UserEntity } from "@src/entity/user.entity";
import { UserService } from "./user.services";
import { envs } from "@src/config/envs";

export class Auth{
    public static user:any;
    public init = async (userId:number) => {
        try {
            let _user = await Connection.redisClient.get(`[user][${userId}]`);
            if(_user){
                _user = JSON.parse(_user);
                Auth.user = UserEntity.toJson(_user.user).user;
            }else{
                let user = await UserService.user(userId);
                let _user = UserEntity.toJson(user);
                Auth.user = _user.user;
                Connection.redisClient.set(`[user][${userId}]`,JSON.stringify(_user),{ 'EX': envs.EXPIRED_CACHE_SESSION });
            }
        } catch (error) {
            throw error;
        }
    }
}