import { ICategories } from "@src/interfaces/categories.interface";

export class CategoryEntity{
    constructor(
        public id: number,
        public name: string,
        public description: string, 
        public created_at: Date,
        public updated_at: Date
        ){}

    static toJson(object:{[key:string]:any}):CategoryEntity{
        return new CategoryEntity(object.id,object.name,object.description,object.created_at,object.updated_at);
    }

}