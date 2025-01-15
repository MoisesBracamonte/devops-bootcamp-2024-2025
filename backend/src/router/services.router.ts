import { ServicesController } from "@src/controllers/services.controller";
import { Router } from "express";

export class ServicesRouter{
    constructor(){}

    static get route():Router{
        const router = Router();
        const _c = new ServicesController();
        router.get('/', _c.get);
        router.post('/create', _c.create);
        router.get('/id/:id',_c.getService);
        return router;
    }
}