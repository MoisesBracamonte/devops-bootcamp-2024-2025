import { CustomError } from '@src/config/CustomError';
import { type_of_user_enum } from '@src/interfaces/user.interface';
import * as Yup from 'yup';

export class ClientsDto{
    constructor(
        public name:string,
        public email:string,
        public phone:string, 
        public id?:string | number,
        public medicalHistory?:string
    ){}

    static validate(object:{[key:string]:any}, action:'create' | 'update' = 'create'):[Record<string, any> | undefined, ClientsDto?]{
        let objectYup:any = {
            name: Yup.string().required('The name is required'),
            email: Yup.string().email('Invalid email format').required('The email is required'),
            phone: Yup.string().required("the phone is required")
        };
        if(action === 'update'){
            objectYup['id'] = Yup.string().required('The id is required');

        }
        const schema = Yup.object().shape(objectYup);
    
        try {
            schema.validateSync(object,{ abortEarly:false});
            const clientsDto = new ClientsDto(object.name, object.email, object.phone,object.id ? object.id : undefined,undefined);
            return [undefined, clientsDto];
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