import { CustomError } from '@src/config/CustomError';
import { type_of_user_enum } from '@src/interfaces/user.interface';
import * as Yup from 'yup';

export class CategoriesDto{
    constructor(
        public name:string, 
        public description:string, 
        public type_of_user: type_of_user_enum){}

    static validate(object:{[key:string]:any}):[Record<string, any> | undefined, CategoriesDto?]{
        const schema = Yup.object().shape({
            name: Yup.string().required('The name is required'),
            description: Yup.string().required('Description is required'),
            type_of_user: Yup.mixed<type_of_user_enum>()
            .oneOf(Object.values(type_of_user_enum), 'The account type must be organization or individual')
            .required('type_of_user is required'),
        });
    
        try {
            schema.validateSync(object,{ abortEarly:false});
            const categoriesDto = new CategoriesDto(object.name, object.description, object.type_of_user);
            return [undefined, categoriesDto];
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const errors:any= error.inner.map(err => ({ field: err.path, message: err.message }));
                return [
                    CustomError.badRequest(errors[0].message,{[errors[0].field]: [errors[0].message] }),
                    undefined
                ]
            }
            return [{ message:'Internal server error', statusCode: 500, data: {} }, undefined]
        }
    
    }


}