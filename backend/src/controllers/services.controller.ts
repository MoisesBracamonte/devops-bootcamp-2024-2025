import { CustomError } from "@src/config/CustomError";
import { CustomSuccess } from "@src/config/CustomSuccess";
import { ServicesDto } from "@src/dtos/services.dto";
import { ServiceEntity } from "@src/entity/service.entity";
import { ServicesService } from "@src/services/services.service";
import { Request, Response } from "express";

export class ServicesController{
    protected servicesService:ServicesService
    constructor(){
        this.servicesService = new ServicesService();
    }

    get = (request:Request, response:Response) => {
        const { categories } = request.query;
        if(categories === "Y"){
            this.servicesService.categories = categories;
        }
        this.servicesService.get().then((resp) => response.json(CustomSuccess.ok('All services', resp)))
        .catch((error) => CustomError.handleError(error, response))
    }

    getService = (request:Request, response:Response) => {
        const { categories } = request.query;
        const { id } = request.params
        if(!id){
            return CustomError.handleError(CustomError.badRequest('Id is required',{id: 'Id is required'}))
        }
        if(categories === "Y"){
            this.servicesService.categories = categories;
        }
        this.servicesService.getService(id).then((resp) => response.json(CustomSuccess.ok('Service', resp)))
        .catch((error) => CustomError.handleError(error, response));
    }
    create = (request:Request,response:Response) => {
        const [ errors, servicesDto] = ServicesDto.validate(request.body);
        if(errors){ return CustomError.handleError(errors,response) }
        this.servicesService.create(servicesDto!)
        .then((resp) => response.json(CustomSuccess.ok('service is created', resp)))
        .catch((error) => CustomError.handleError(error,response))
    }
}