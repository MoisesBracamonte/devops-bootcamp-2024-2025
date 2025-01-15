import { Connection } from "@src/config/database";
import { ClientsDto } from "@src/dtos/clients.dto";
import { type_of_user_enum } from "@src/interfaces/user.interface";
import { Auth } from "@src/services/auth.service";

export class ClientModel{

    async create(clientResp:ClientsDto){
        const [client] = await Connection.knexPool('clients').insert({
            name: clientResp.name,
            email: clientResp.email,
            phone: clientResp.phone,
            user_id: Auth.user.type_of_user === type_of_user_enum.individual  ? Auth.user.id  : null,
            organization_id: Auth.user.type_of_user === type_of_user_enum.organization ? Auth.user.id_organization : null,
            created_at: new Date(),
            updated_at: Connection.knexPool.fn.now()
        }).returning('*');
        return client;
    }

    async get(){
        const clients = await Connection.knexPool('clients')
        .modify( (query:any ) => {
            if(Auth.user.type_of_user === type_of_user_enum.individual){
                query.where('clients.user_id',Auth.user.id)
                query.whereNull('clients.organization_id')
            }
            if(Auth.user.type_of_user === type_of_user_enum.organization){
                query.where('clients.organization_id', Auth.user.id_organization)
                query.whereNull('clients.user_id')
            }
        });
        return clients
    }

    async getClient(id:string){
        const [client] = await Connection.knexPool('clients')
        .where("id", id)
        .modify( (query:any ) => {
            if(Auth.user.type_of_user === type_of_user_enum.individual){
                query.where('clients.user_id',Auth.user.id)
                query.whereNull('clients.organization_id')
            }
            if(Auth.user.type_of_user === type_of_user_enum.organization){
                query.where('clients.organization_id', Auth.user.id_organization)
                query.whereNull('clients.user_id')
            }
        });
        return client;
    }

    async update(clientResp:ClientsDto){
        console.log(clientResp);
        const [client] = await Connection.knexPool('clients').update({
            name: clientResp.name,
            email: clientResp.email,
            phone: clientResp.phone,
            updated_at: Connection.knexPool.fn.now()
        }).where('id', clientResp.id)
        .modify( (query:any ) => {
            if(Auth.user.type_of_user === type_of_user_enum.individual){
                query.where('clients.user_id',Auth.user.id)
                query.whereNull('clients.organization_id')
            }
            if(Auth.user.type_of_user === type_of_user_enum.organization){
                query.where('clients.organization_id', Auth.user.id_organization)
                query.whereNull('clients.user_id')
            }
        }).returning('*');
        return client;
    }
}