import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { accessToken } from "../middleware/accessToken";

export class UserRouter{
    static get route():Router{
        const router = Router();
        const _c = new UserController();
        router.get("/",accessToken,_c.user);
        router.post("/register", _c.register)
        router.get("/validate/:id", _c.validateAccount);
        router.post('/login', _c.login);
        return router;
    }
}