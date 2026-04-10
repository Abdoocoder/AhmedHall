import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 backdrop-blur px-4">
          <SidebarTrigger className="-mr-1 hover:bg-primary/10" />
          <Separator orientation="vertical" className="mx-2 h-4 bg-primary/30" />
          <h1 className="text-lg font-bold tracking-wide font-mono">AHMEDHALL<span className="text-primary/60 text-sm font-normal">_DASHBOARD</span></h1>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
