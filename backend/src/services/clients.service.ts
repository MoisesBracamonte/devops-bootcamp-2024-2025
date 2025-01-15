import { CustomError } from "@src/config/CustomError";
import { ClientsDto } from "@src/dtos/clients.dto";
import { ClientEntity } from "@src/entity/client.entity";
import { Iclient } from "@src/interfaces/clients.interface";
import { ClientModel } from "@src/models/client.model";

export class ClientsService{
    protected clientModel:ClientModel;
    constructor(){
        this.clientModel= new ClientModel();
    }

    async create(client:ClientsDto){
        try {
            const response = await this.clientModel.create(client);
            const entity = ClientEntity.toJson(response);
            return entity;
        } catch (error) {
            throw error;
        }

    }

    async get(){
        try {
            const response = await this.clientModel.get();
            const clients:ClientEntity[] = response.map( (client:Iclient) => ClientEntity.toJson(client));
            return clients;
        } catch (error) {
            throw error;
        }

    }
    async getClient(id:string){
        try {
            const response = await this.clientModel.getClient(id);
            if(!response){ throw CustomError.notFound('Client not found',{}); }
            const client:ClientEntity = ClientEntity.toJson(response);
            return client;
        } catch (error) {
            throw error;
        }

    }
    async update(client:ClientsDto){
        try {
            const response = await this.clientModel.update(client);
            const entity = ClientEntity.toJson(response);
            return entity;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}