"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { signInSchema } from "@/lib/zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { z } from "zod"
import { sigInAction } from "@/actions/signIn.action"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
export const FormLogin = () => {

    const [isPending, startTransition] = useTransition();
    const [ error, setError ] = useState< Record<string, any> | null>(null);
    const router = useRouter();
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues:{
            email: '', 
            password:''
        }
    });

    const onSubmit = async ( values: z.infer<typeof signInSchema> ) => {
      setError(null);
      startTransition(async () => {
        const response:any = await sigInAction(values);
        if (response.status && response.status != 200 ) {
          setError(response);
        } else {
          router.push("/dashboard");
        }
      });
    }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-0 mt-2">
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input type='email' placeholder="Correo electrónico" {...field} />
              </FormControl>
              <FormMessage />
              {
                error && error.data?.errors.email && (<FormMessage>{error.data?.errors.email}</FormMessage>)
              }
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-0 ">
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type='password' placeholder="Contraseña" {...field} />
              </FormControl>
              <FormMessage />
              {
                error && error.data?.errors.password && (<FormMessage>{error.data?.errors.password}</FormMessage>)
              }
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>

  )
}