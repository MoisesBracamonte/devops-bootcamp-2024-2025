'use server'
import { axiosRequest } from "@/lib/axiosDB";

export const registerCategory = async (category:{ name:string, description:string}) => {
    try {
        const response = await axiosRequest({
            method:'post',
            url:`${process.env.NEXT_PUBLIC_API_URL}/api/categories/create`,
            data: category
        });
        const { data } = response;
        return data;
    } catch (error:any) {
        const { response } = error;
        return response.data;
    }
}