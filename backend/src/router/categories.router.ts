import { CategoriesController } from "@src/controllers/categories.controller";
import { Router } from "express";

export class CategoriesRouter{
    static get route():Router{
        const router = Router();
        const _c = new CategoriesController();
        router.post('/create',_c.create);
        router.get('/', _c.get);
        return router;
    }
}