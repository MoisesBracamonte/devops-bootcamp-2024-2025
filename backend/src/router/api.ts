import { Router } from "express";
import { UserRouter } from "./user.router";
import { CategoriesRouter } from "./categories.router";
import { accessToken } from "@src/middleware/accessToken";
import { ServicesRouter } from "./services.router";
import { ClientsRouter } from "./clients.router";

export class ApiRouter{
    static get route():Router{
        const router = Router();
        router.use("/api/user", UserRouter.route);
        router.use("/api/categories",accessToken,CategoriesRouter.route);
        router.use("/api/services",accessToken,ServicesRouter.route);
        router.use("/api/clients",accessToken,ClientsRouter.route);
        return router;
    }
}