import { CustomError } from "@src/config/CustomError";
import { CustomSuccess } from "@src/config/CustomSuccess";
import { ClientsDto } from "@src/dtos/clients.dto"
import { ClientsService } from "@src/services/clients.service";
import { Request, Response } from "express"

export class ClientsController{

    protected clientService:ClientsService
    constructor(){
        this.clientService = new ClientsService();
    }
    create = (request:Request, response:Response) => {
        const [errors, clientDto] = ClientsDto.validate(request.body);
        if(errors){ return CustomError.handleError(errors,response) }
        this.clientService.create(clientDto!).then( (resp:any) => response.json(CustomSuccess.ok('Client is created', resp)))
        .catch( error => CustomError.handleError(error,response))
    }

    get = (request:Request, response:Response) => {
        this.clientService.get().then((resp) => response.json(CustomSuccess.ok('All Clients', resp)))
        .catch((error) => CustomError.handleError(error, response))

    }

    getClient = (request:Request, response:Response) => {
        const { id }  = request.params;
        this.clientService.getClient(id).then((resp) => response.json(CustomSuccess.ok('Client', resp)))
        .catch((error) => CustomError.handleError(error, response))
    }

    update = (request:Request, response:Response) => {
         const [ errors, clientDto ] = ClientsDto.validate(request.body, 'update');
         if(errors){ return CustomError.handleError(errors,response) }
         this.clientService.update(clientDto!).then( (resp:any) => response.json(CustomSuccess.ok('Client is created', resp)))
         .catch( error => CustomError.handleError(error,response))
 
    }
}