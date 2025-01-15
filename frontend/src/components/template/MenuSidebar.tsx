'use client'
import { CalendarRange, Home, Package2, ShoppingCart, Users } from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

export const MenuSidebar = () => {
    const pathname =  usePathname();
    return ( 
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                  href="/dashboard"
                  className={ `
                    ${ pathname === "/dashboard"  ? 'bg-muted' : '' }
                    max-sm:mx-[-0.65rem] flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:text-primary` }
              >
                  <Home className="h-4 w-4" />
                  Dashboard
              </Link>
              <Link
                  href="/calendario"
                  className={ `
                    ${ pathname === "/calendario"  ? 'bg-muted' : '' }
                    max-sm:mx-[-0.65rem] flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:text-primary` }
              >
                  <CalendarRange  className="h-4 w-4"/>
                  Calendario
            </Link>
            <Link
              href="/servicios"
              className={ `
                ${ pathname === "/servicios"  ? 'bg-muted' : '' }
                max-sm:mx-[-0.65rem] flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:text-primary` }
        >
              <ShoppingCart className="h-4 w-4" />
              Servicios
              {/* <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                6
              </Badge> */}
            </Link>
            <Link
              href="/clientes"
              className={ `
                ${ pathname === "/clientes"  ? 'bg-muted' : '' }
                max-sm:mx-[-0.65rem] flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:text-primary` }
            >
              <Users className="h-4 w-4" />
              Clientes
            </Link>
          </nav>
        </div>
    )
}