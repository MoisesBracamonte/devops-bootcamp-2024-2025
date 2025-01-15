import { signOut, useSession } from "next-auth/react";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface axiosRequestI {
    url: string;
    method?: 'post' | 'get' | 'put' | 'delete';
    data?: any;
}

export const useAxios = (promp:axiosRequestI) => {
    const { data:session, status} = useSession();
    const [data, setData] = useState([]);
    const [error, setError] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    // Esperamos a que la sesión esté cargada para configurar Axios
    const axiosConfig = async () => {
        // Si la sesión está lista, configurar Axios
        let headers: any = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
            'x-scope': 'api-app',
        };

        const instance = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL_CLIENT,
            headers,
        });

        instance.interceptors.request.use(
            async (config) => {
                if (session) {
                    const accessToken = session.user?.accessToken || '';
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
                return config;
            },
            (error: any) => {
                return Promise.reject(error);
            }
        );

        return instance;
    };

    const handleError = async (error: any) => {
        const { response } = error;
        if (response.status === 401) {
            // Redireccionar al login si no está autenticado
            await signOut();
        }
        return error;
    };

    const axiosRequest = async ({ url, method = 'get', data }: axiosRequestI)=> {
        setLoading(true);
        try {
            const req = await axiosConfig();
            const response =  await req[method](url, data);
            const { data:_r } = response;
            setData(_r.data);
            setLoading(false);
        } catch (error: any) {
            const _e = await handleError(error);
            setError(_e);
            setLoading(false);
        }
    };

    useEffect( () => {
        if(session){
            axiosRequest(promp);
        }
    },[session?.user?.accessToken + promp.url]);
    return {
        session, status, data,
    }
};