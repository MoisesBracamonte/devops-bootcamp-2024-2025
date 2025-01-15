import { ServicesDto } from "@src/dtos/services.dto";
import { ServiceEntity } from "@src/entity/service.entity";
import { ServiceModel } from "@src/models/service.model";

export class ServicesService{
    protected serviceModel:ServiceModel;
    public categories:string = "";
    constructor(){
        this.serviceModel = new ServiceModel();
    }

    /** para comenzar se obtendrán todos los servicios, con el tiempo se paginarán */
    async get(){
        try {
            let _m = await this.serviceModel.get(this.categories);
            if(this.categories === "Y"){
                _m = ServiceEntity.toJsonWitCategories(_m);
            }
            const services:ServiceEntity[] = _m.map( (service:any) => ServiceEntity.toJson(service));
            this.categories= "";
            return services;
        } catch (error) {
            throw error; 
        }
    }

    async getService(id:string){
        try {
            let _m = await this.serviceModel.getService(id, this.categories);
            if(this.categories === "Y"){
                _m = ServiceEntity.toJsonWitCategories(_m);
            }
            const services:ServiceEntity =ServiceEntity.toJson(_m[0]);
            this.categories= "";
            return services;
        } catch (error) {
            console.log(error);
            throw error; 
        }
    }
    async create(services:ServicesDto){
        try {
           const _s = await this.serviceModel.create(services);
           const serviceEntity = ServiceEntity.toJson({..._s?.service, categories: _s?.categories});
           return serviceEntity;
        } catch (error) {
            throw error;
        }
    }
}