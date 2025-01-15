import { auth } from "@/auth";
import { ButtonSignOut } from "@/components/ButtonSignOut";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentSales } from "./RecentSales";
import { Overview } from "./Overview";
 
export default async function Page() {
  const session = await auth()
 
  if (!session) {
    return <div>Not authenticated</div>
  }
 
  return (
    <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Servicios Realizados Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{200}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Servicios Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{50}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Facturado (Mes)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3.000.000</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendiente por Facturar (Mes)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1.200.000</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <Overview />
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>
            You made 265 sales this month.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecentSales />
        </CardContent>
      </Card>
    </div>
    </>

  )
}