import { Bell, CalendarRange, Home, Package2, ShoppingCart, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"
import { MenuSidebar } from "@/components/template/MenuSidebar"

export const Sidebar = () => {
    return (
        <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <Package2 className="h-6 w-6" />
                        <span className="">Agenda app V1</span>
                    </Link>
                    <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                        <Bell className="h-4 w-4" />
                        <span className="sr-only">Notificationes</span>
                    </Button>
                </div>
                <MenuSidebar />
            </div>
        </div>
    )
}