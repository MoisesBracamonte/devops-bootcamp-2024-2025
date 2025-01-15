
import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import ListServices from './Table'
import { axiosConfig, axiosRequest } from '@/lib/axiosDB'
import { sleep } from '@/lib/utils'
import { IServiceExtended } from '@/interfaces/services.interface'


export default async function ServicesPage() {
  await sleep(3000)
  const response = await axiosRequest({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/services`});
  const { data:_r } = response;
  return (
      <Card className="w-full max-w-6xl mx-auto shadow-none border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Lista de Servicios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-end">
            <Link href="/servicios/crear">
                <Button>Agregar servicio</Button>
            </Link>
          </div>
          <ListServices services= { _r.data } />
        </CardContent>
      </Card>
  )
}