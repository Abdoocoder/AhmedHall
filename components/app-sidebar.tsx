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
    <Sidebar side="right" collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="relative size-10 overflow-hidden rounded-lg">
            <Image
              src="/logo.png"
              alt="شعار البلدية"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold">البلدية</span>
            <span className="text-xs text-sidebar-foreground/70">نظام الحجوزات</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>القائمة الرئيسية</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon />
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
          className="w-full cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="size-4" />
          <span>تسجيل الخروج</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  )
}
