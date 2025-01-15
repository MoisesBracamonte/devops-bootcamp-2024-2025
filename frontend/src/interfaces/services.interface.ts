export enum service_status_enum{
    ACTIVE= 'active',
    INACTIVE= 'inactive'
}

export interface IService{
    name: string, 
    prices: number,
    percentage: number,
    status: 'active' | 'inactive',
    categories:number[],
}

export interface IServiceExtended extends IService{
    idd: number,
    created_at: Date,
    updated_at:Date,
}