import { CategoriesDto } from "@src/dtos/categories.dto";
import { CategoryEntity } from "@src/entity/category.entity";
import { CustomSuccess } from "@src/config/CustomSuccess";
import { CategoryModel } from "@src/models/category.model";
import { ICategories } from "@src/interfaces/categories.interface";

export class CategoriesService{
    protected categoryModel:CategoryModel;
    constructor(){
        this.categoryModel = new CategoryModel();
    }

    async create(category:CategoriesDto){
        try{
            const insert = await this.categoryModel.insert(category);
            const entity = CategoryEntity.toJson(insert[0]);
            return CustomSuccess.ok('Category is created', entity);
        }catch(error){
            throw error;
        }
    }

    async get(){
        try {
            const response:ICategories[] = await this.categoryModel.get();
            const categories:CategoryEntity[]= response.map( (category:ICategories) => CategoryEntity.toJson(category));
            return CustomSuccess.ok('categories', categories);
        } catch (error) {
            throw error;
        }
    }
}