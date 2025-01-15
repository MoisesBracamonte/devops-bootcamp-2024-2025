'use server'
import { ServicesDto } from "@/dtos/services.dto";
import { IService } from "@/interfaces/services.interface";
import { axiosRequest } from "@/lib/axiosDB";

export const registerService = async (service:IService) => {
    try {
        const response = await axiosRequest({
            method:'post',
            url:`${process.env.NEXT_PUBLIC_API_URL}/api/services/create`,
            data: service
        });
        const { data } = response;
        return data;
    } catch (error:any) {
        const { response } = error;
        return response.data;
    }
}