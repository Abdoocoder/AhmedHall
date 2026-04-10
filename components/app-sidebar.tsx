"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Building2,
  Users,
  LogOut,
  Settings,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { logout } from "@/app/actions/auth"

const menuItems = [
  {
    title: "لوحة التحكم",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "الحجوزات",
    url: "/bookings",
    icon: ClipboardList,
  },
  {
    title: "التقويم",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "القاعات",
    url: "/rooms",
    icon: Building2,
  },
  {
    title: "الجهات",
    url: "/organizations",
    icon: Users,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar side="right" collapsible="icon" className="border-l border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="relative size-10 overflow-hidden rounded-md bg-primary/10 p-1">
            <Image
              src="/logo.png"
              alt="شعار البلدية"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold tracking-wide uppercase">AhmedHall</span>
            <span className="text-xs text-sidebar-foreground/60 font-mono">GPU COMPUTING</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-mono text-xs uppercase tracking-wider px-2">System Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className="font-medium"
                  >
                    <Link href={item.url} className="group-data-[collapsed=true]:justify-center">
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenuButton
          onClick={() => logout()}
          tooltip="تسجيل الخروج"
          className="w-full cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="size-4" />
          <span className="font-mono text-xs uppercase">LOGOUT</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  )
}
