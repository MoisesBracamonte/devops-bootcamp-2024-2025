import { CustomError } from '../config/CustomError';
import * as Yup from 'yup';
export class LoginDto{
    constructor(public email: string,public password:string){}


    static validate(object:{[key:string]:any}):[Record<string, any> | undefined, LoginDto?]{
        const schema = Yup.object().shape({
            email: Yup.string().email("Invalid email format").required("The email is required"),
            password: Yup.string().required("The password is required")
        });
        try {
            schema.validateSync(object,{ abortEarly:false});
            const loginDto= new LoginDto(object.email, object.password);
            return [undefined, loginDto];
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const errors:any= error.inner.map(err => ({ field: err.path, message: err.message }));
                return [CustomError.badRequest(errors[0].message,{[errors[0].field]: [errors[0].message]}),undefined];
            }
            return [CustomError.internalServer('Internal server error'), undefined]
        }
    }
}