import { Connection } from "@src/config/database";
import { ServicesDto } from "@src/dtos/services.dto";
import { ICategories } from "@src/interfaces/categories.interface";
import { type_of_user_enum } from "@src/interfaces/user.interface";
import { Auth } from "@src/services/auth.service";

export class ServiceModel{
    constructor(){}

    async get(categories:string=""){
        const services = await Connection.knexPool('services')
        .modify( (query:any ) => {
            if(Auth.user.type_of_user === type_of_user_enum.individual){
                query.where('services.user_id',Auth.user.id)
                query.whereNull('services.organization_id')
            }
            if(Auth.user.type_of_user === type_of_user_enum.organization){
                
                query.where('services.organization_id', Auth.user.id_organization)
                query.whereNull('services.user_id')
            }
            if(categories === "Y"){
                query.select(
                    'services.*',
                    'categories.id as id_category',
                    'categories.name as name_category',
                    'categories.description as description_category',
                    'categories.created_at as created_at_category',
                    'categories.updated_at as updated_at_category',
                )
                query.innerJoin("category_service", "category_service.service_id","services.id")
                query.innerJoin("categories", "category_service.category_id","categories.id")
            }
        });
        return services;
    }

    async getService(id:string, categories:string=""){
        const service = await Connection.knexPool('services')
        .where('services.id', id)
        .modify( (query:any ) => {
            if(Auth.user.type_of_user === type_of_user_enum.individual){
                query.where('services.user_id',Auth.user.id)
                query.whereNull('services.organization_id')
            }
            if(Auth.user.type_of_user === type_of_user_enum.organization){
                
                query.where('services.organization_id', Auth.user.id_organization)
                query.whereNull('services.user_id')
            }
            if(categories === "Y"){
                query.select(
                    'services.*',
                    'categories.id as id_category',
                    'categories.name as name_category',
                    'categories.description as description_category',
                    'categories.created_at as created_at_category',
                    'categories.updated_at as updated_at_category',
                )
                query.innerJoin("category_service", "category_service.service_id","services.id")
                query.innerJoin("categories", "category_service.category_id","categories.id")
            }
        });
        return service;
    }

    async create(services:ServicesDto){
        const trx = await Connection.knexPool.transaction();
        try{
            const [service] = await trx('services').insert({
                name: services.name,
                prices: services.prices,
                percentage: services.percentage,
                status: services.status,
                user_id: Auth.user.type_of_user === type_of_user_enum.individual  ? Auth.user.id  : null,
                organization_id: Auth.user.type_of_user === type_of_user_enum.organization ? Auth.user.id_organization : null,
                created_at: new Date(),
                updated_at: new Date()
            }).returning('*');

            // primero debo obtener las categorias que corresponde a la cuenta. 
            const categories = await trx('categories')
            .select('*')
            .whereIn('id', services.categories)
            .modify( (query:any ) => {
                if(Auth.user.type_of_user === type_of_user_enum.individual){
                    query.where('categories.user_id',Auth.user.id)
                    query.whereNull('organization_id')
                }
                if(Auth.user.type_of_user === type_of_user_enum.organization){
                    query.where('categories.organization_id', Auth.user.id_organization)
                    query.whereNull('user_id')
                }
            });

            const values = categories.map((_c:ICategories) => ({ category_id:_c.id, service_id: service.id, created_at: new Date(), updated_at: new Date() }));
            const [ categoriesService ] = await trx('category_service').insert(values).returning('id');
            await trx.commit();
            return {
                service,
                categories
            }
        }catch(error){
            await trx.rollback();
            throw error;
        };

    }
}