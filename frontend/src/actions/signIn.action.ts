'use server'
import { signIn } from "@/auth";
import { signInSchema } from "@/lib/zod"
import { AuthError } from "next-auth";
import { z } from "zod"

export const sigInAction = async (values: z.infer<typeof signInSchema>) => {
    try {
        const response  = await signIn('credentials', {
            email: values.email,
            password: values.password,
            redirect:false,
        });
        return { success: true }
    } catch (error) {
        if (error instanceof AuthError) {
            const serializar = JSON.parse(error.cause?.err?.message || "{ message: 'No se pudo procesar la solicitud' }");
            return serializar;
        }
        return { message: 'No se pudo procesar la solicitud' };
    }
}