import { CustomError } from '@src/config/CustomError';
import { service_status_enum } from '@src/interfaces/service.interface';
import * as Yup from 'yup';


export class ServicesDto{
    constructor(
        public name:string, 
        public prices:number, 
        public percentage:number,
        public status: 'active' | 'inactive',
        public categories: number[]
    ){}

    static validate(object:{[key:string]:any}):[Record<string, any> | undefined, ServicesDto?]{
        const schema = Yup.object().shape({
            name: Yup.string().required('the name is required'),
            prices: Yup.number().required('the prices is required'),
            percentage: Yup.number().required('the percentage  is required'),
            status: Yup.mixed<service_status_enum>().oneOf(Object.values(service_status_enum),'the status must be active or inactive')
            .required('the status is required'),
            categories: Yup.array().of(Yup.number().typeError("All elements must be numbers."))
            .transform((value) => {
                if (typeof value === 'string') {
                  try {
                    return JSON.parse(value);
                  } catch {
                    return [];
                  }
                }
                return value;
              })
            .required("categories is required")
            .min(1, "The array must have at least one element")
        });

        try {
            schema.validateSync(object,{ abortEarly:false});
            const serviceDto = new ServicesDto(object.name, object.prices, object.percentage, object.status, object.categories);
            return [undefined, serviceDto];
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