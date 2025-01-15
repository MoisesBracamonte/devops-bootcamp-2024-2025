import { Sidebar } from "@/components/template/Sidebar"
import { Header } from "@/components/template/Header"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "sonner"

export const description =
  "A products dashboard with a sidebar navigation and a main content area. The dashboard has a header with a search input and a user menu. The sidebar has a logo, navigation links, and a card with a call to action. The main content area shows an empty state with a call to action."

export default function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode,
  }>) {
  return (
    <SessionProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <div className="flex flex-col">
          <Header />
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                { children }
                <Toaster position='top-right' />
          </main>
        </div>
      </div>
    </SessionProvider>
    )
}
