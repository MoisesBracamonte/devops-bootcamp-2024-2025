import { IService, service_status_enum } from '@/interfaces/services.interface';
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
            prices: Yup.number()
            .transform((value, originalValue) => (originalValue ? parseFloat(originalValue) : null))
            .required('the prices is required'),
            percentage: Yup.number().transform((value, originalValue) => (originalValue ? parseFloat(originalValue) : null)).required('the percentage  is required'),
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
            .min(1, "must have at least one element")
        });

        try {
            schema.validateSync(object,{ abortEarly:false});
            const serviceDto = new ServicesDto(object.name, object.prices, object.percentage, object.status, object.categories);
            return [undefined, serviceDto];
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const errors:any= error.inner.map(err => ({ field: err.path, message: err.message }));
                return [
                    { message: errors[0].message, errors:{[errors[0].field]: [errors[0].message] }},
                    // CustomError.badRequest(errors[0].message,{[errors[0].field]: [errors[0].message] }),
                    undefined
                ]
            }
            return [{ message:'Internal server error', statusCode: 500, data: {} }, undefined]
        }
    }

    static toJson(service:ServicesDto):IService{
        return {
            name: service.name,
            prices: service.prices,
            status: service.status,
            percentage: service.percentage,
            categories: service.categories.map(Number)
        }
    }

}