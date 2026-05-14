export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | نظام حجوزات قاعة البلدية',
    default: 'نظام حجوزات قاعة البلدية',
  },
}

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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:rounded-full focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
      >
        تخطى إلى المحتوى الرئيسي
      </a>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6 bg-card">
          <SidebarTrigger className="-mr-2 hover:bg-accent rounded-full" />
          <Separator orientation="vertical" className="mx-2 h-4" />
          <h1 className="text-lg font-medium">نظام حجوزات قاعة البلدية</h1>
        </header>
        <main id="main-content" className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
