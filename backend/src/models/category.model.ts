import { Connection } from "@src/config/database";
import { CategoriesDto } from "@src/dtos/categories.dto";
import { type_of_user_enum } from "@src/interfaces/user.interface";
import { Auth } from "@src/services/auth.service";

export class CategoryModel{

    async insert(category:CategoriesDto){
        return await Connection.knexPool('categories').insert({
            name: category.name,
            description: category.description,
            user_id: category.type_of_user === type_of_user_enum.individual  ? Auth.user.id  : null,
            organization_id: category.type_of_user === type_of_user_enum.organization ? Auth.user.id_organization : null,
            created_at: new Date(),
            updated_at: new Date()
        }).returning('*')
    }

    async get(){
        return await Connection.knexPool('categories')
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
    }
}