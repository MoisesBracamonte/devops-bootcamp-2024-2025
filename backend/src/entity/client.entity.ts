export class ClientEntity{
    constructor(
        public name:string,
        public email:string,
        public phone:string,
        public created_at?:Date,
        public updated_at?:Date,
    ){}

    static toJson(object:{[key:string]:any}):ClientEntity{
        return new ClientEntity(object.name, object.email,object.phone, object.created_at, object.updated_at);
    }
}