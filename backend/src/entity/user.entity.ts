enum type_of_user_enum{
    individual= 'individual',
    organization= 'organization'
}

type  IUser={
    name: string,
    email: string,
    phone: string,
    is_active: string,
    password?:string,
    accessToken?:string,
    type_of_user: type_of_user_enum,
    name_organization?: string,
    industry_organization?: string,
    phone_organization?: string,
    address_organization?: string,
    num_employees_organization?: string
}
type  IUserWithOrganization = IUser &{
    type_of_user: type_of_user_enum.organization
    id_organization:string | number,
    name_organization: string,
    industry_organization: string,
    phone_organization: string,
    address_organization: string,
    num_employees_organization: string
}
type IUserEntity = IUser | IUserWithOrganization;

export class UserEntity{
    constructor(public user:IUserEntity){};
    static toJson(object:{ [key:string]:any }):UserEntity{
        let _u;
        const user = object as IUser | IUserWithOrganization;
        const {password, ...props} = user;
        _u = props;
        if(_u.type_of_user === type_of_user_enum.individual){
            const { name_organization,
                industry_organization,
                phone_organization,
                address_organization,
                num_employees_organization,
                ...props}=_u;
                _u = props;
        }
        const entity = new UserEntity(_u);
        return entity;
    }
}