import { CustomError } from '@src/config/CustomError';
import { ICategories } from '@src/interfaces/categories.interface';
import { service_status_enum } from '@src/interfaces/service.interface';
import * as Yup from 'yup';


export class ServiceEntity{
    constructor(
        public id:number,
        public name:string, 
        public prices:number, 
        public percentage:number,
        public status: 'active' | 'inactive',
        public categories?: ICategories[],
        public created_at?: Date,
        public updated_at?: Date,

    ){}

    static toJson(object:{[key:string]:any}):ServiceEntity{
        return new ServiceEntity(object.id, object.name, object.prices, object.percertange, object.status,object.categories, object.created_at,object.updated_at);
    }

    static toJsonWitCategories(object:{[key:string]:any}):ServiceEntity[]{

        const data:ServiceEntity[]  = Object.values(
            object.reduce((acce:any, item:any) => {
                if(!acce[item.id]){
                    acce[item.id] = {
                        id: item.id, 
                        name: item.name,
                        prices: item.prices,
                        percentage: item.percentage,
                        status: item.status,
                        categories:[],
                        created_at: item.created_at,
                        updated_at: item.updated_at,
                    }
                }
                acce[item.id].categories.push({
                    id: item.id_category,
                    name: item.name_category,
                    description: item.description_category,
                    created_at: item.created_at_category,
                    updated_at: item.updated_at_category
                });
                return acce;
            },{})
        )
        return data;
    }

}