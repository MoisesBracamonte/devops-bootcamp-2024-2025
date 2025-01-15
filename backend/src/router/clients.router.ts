import { ClientsController } from "@src/controllers/clients.controller";
import { Router } from "express";

export class ClientsRouter{
    static get route():Router{
        const router = Router();
        const _c = new ClientsController();
        router.get("/", _c.get);
        router.get("/id/:id", _c.getClient);
        router.post("/create", _c.create);
        router.put("/update", _c.update);
        return router;
    }
}