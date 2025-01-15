
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { SkeletonTable } from '@/components/template/SkeletonTable'


export default async function LoadingPage() {
  return (
      <Card className="w-full max-w-6xl mx-auto shadow-none border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Lista de Servicios</CardTitle>
        </CardHeader>
        <CardContent>
            <SkeletonTable />
        </CardContent>
      </Card>
  )
}