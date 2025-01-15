import { auth } from '@/auth';
import axios, { AxiosResponse } from 'axios';
import { NextResponse } from 'next/server';

export const axiosConfig = async () => {
    let headers:any = { 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
        'x-scope': 'api-app',
    };
    const instance =  axios.create({
        baseURL: process.env.EXPO_PUBLIC_API_URL,
        headers,
    });
    instance.interceptors.request.use( async ( config ) => {
        const session = await auth(); 
        if(session){
           const accessToken = session?.user?.accessToken || '';
           config.headers.Authorization = `Bearer ${ accessToken }`;
         }
         return config;
    }, ( error ) => {
        return Promise.reject(error);
    });
    return instance;

};

interface axiosRequestI{
    url:string;
    method?: 'post' | 'get' | 'put' | 'delete';
    data?:any;
}

export const axiosRequest = async ({url, method = 'get', data }: axiosRequestI):Promise<AxiosResponse | never> => {
    try {
        const  req = await axiosConfig();
        return await req[method](url, data);
    } catch (error:any) {
        throw handleError(error);
    }
}

export const handleError = ( error:any ) =>{
    const { response } = error;
    console.log('@handleError', error)
    // if( response.status === 401 ){
    //     return NextResponse.redirect('/login');
    // }
    return error;
}

