import { JwtConfig } from "@src/config/jwt";
import { CustomError } from "../config/CustomError";
import { NextFunction, Request, Response } from "express";
import { UserService } from "@src/services/user.services";
import { IsessionVerify } from "@src/interfaces/user.interface";
import { Auth } from "@src/services/auth.service";
import { JsonWebTokenError } from "jsonwebtoken";

export async function accessToken(request:Request, response:Response,next:NextFunction){
    try {
        const accessToken = request.headers.authorization?.split(" ")[1];
        if(!accessToken){
            return CustomError.handleError(CustomError.unauthorized('unauthorized',{}),response);
        }
        const verify = await JwtConfig.validate(accessToken);
        const session:IsessionVerify =  await UserService.verifySession(verify.token);
        if(session.revoked){
            return CustomError.handleError(CustomError.unauthorized('unauthorized',{}), response);
        }
        const auth = new Auth();
        await auth.init(verify.id);
        next();
    } catch (error) {
        if(error instanceof JsonWebTokenError){
            return CustomError.handleError(CustomError.unauthorized('unauthorized',{}), response);
        }
        return CustomError.handleError(error,response);
    }
}