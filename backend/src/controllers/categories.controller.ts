import { CustomError } from "@src/config/CustomError";
import { CategoriesDto } from "@src/dtos/categories.dto";
import { Auth } from "@src/services/auth.service";
import { CategoriesService } from "@src/services/categories.service";
import { Request, Response } from "express";

export class CategoriesController{

    private readonly categoryService:CategoriesService;
    constructor(){
        this.categoryService = new CategoriesService();
    }

    create = (request:Request, response:Response ) => {
        const _u = Auth.user;
        const [error, categoryDto] = CategoriesDto.validate({...request.body, type_of_user: _u.type_of_user });
        if(error){ return CustomError.handleError(error,response) }
        this.categoryService.create(categoryDto!).then(resp => {
            response.json(resp);
        }).catch(error => {
            return CustomError.handleError(error,response);
        });
    }
    
    get = (request:Request, response:Response) => {
        this.categoryService.get().then(resp => response.json(resp))
        .catch(error => CustomError.handleError(error, response))
    }

}