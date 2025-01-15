import * as Yup from 'yup';
enum type_of_user_enum{
    individual= 'individual',
    organization= 'organization'
}

interface  IUser{
    name: string,
    email: string,
    password: string,
    phone: string,
    is_active: string,
    type_of_user: type_of_user_enum,
    name_organization?: string,
    industry_organization?: string,
    phone_organization?: string,
    address_organization?: string,
    num_employees_organization?: string
}
type  IUserWithOrganization = IUser &{
    type_of_user: type_of_user_enum.organization
    name_organization: string,
    industry_organization: string,
    phone_organization: string,
    address_organization: string,
    num_employees_organization: string
}
type IUserDto = IUser | IUserWithOrganization;

export class UserDto{
    constructor(public user:IUserDto){};
    static validate(object:{ [key:string]:any }):[Record<string, any> | undefined, UserDto?]{
        const schema = Yup.object().shape({
            name: Yup.string().required('The name  is required'),
            email: Yup.string().email('Invalid email format').required('The email is required'),
            password: Yup.string().required('The password is required'),
            type_of_user: Yup.mixed<type_of_user_enum>()
                .oneOf(Object.values(type_of_user_enum), 'The account type must be organization or individual')
                .required('type_of_user is required'),

            // Validación de campos de la organización
            name_organization: Yup.string().when('type_of_user', {
                is: (type_of_user: type_of_user_enum) =>  type_of_user === 'organization',
                then: () => Yup.string().required('Organization name is required'),
            }),
            industry_organization: Yup.string().when('type_of_user', {
                is: (type_of_user: type_of_user_enum) =>  type_of_user === 'organization',
                then: () => Yup.string().required('Industry name is required'),
            }),
            phone_organization: Yup.string().when('type_of_user', {
                is: (type_of_user: type_of_user_enum) =>  type_of_user === 'organization',
                then: () => Yup.string().required('Phone name is required'),
            }),
            address_organization: Yup.string().when('type_of_user', {
                is: (type_of_user: type_of_user_enum) =>  type_of_user === 'organization',
                then: () => Yup.string().required('Address name is required'),
            }),
            num_employees_organization: Yup.string().when('type_of_user', {
                is: (type_of_user: type_of_user_enum) =>  type_of_user === 'organization',
                then: () => Yup.string().required('Number employees is required'),
            }),
        });

        try {
            let _u;
            schema.validateSync(object,{ abortEarly:false});
            const user = object as IUser | IUserWithOrganization;
            if(user.type_of_user === type_of_user_enum.individual){
                const { name_organization,
                    industry_organization,
                    phone_organization,
                    address_organization,
                    num_employees_organization,
                    ...props}=user;
                    _u = props;

            }else{
                _u = user;
            }

            const userDto = new UserDto(_u);
            return [undefined, userDto];
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const errors:any= error.inner.map(err => ({ field: err.path, message: err.message }));
                return [
                    {
                        statusCode: 400,
                        message: errors[0].message,
                        data: {
                            [errors[0].field]: [errors[0].message]
                        }
                    }, undefined
                ]
            }
            return [{ message:'Internal server error', statusCode: 500, data: {} }, undefined]
        }
    }
}