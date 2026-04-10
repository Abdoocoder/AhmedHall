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
  Inbox,
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
  {
    title: "طلبات الحجز",
    url: "/requests",
    icon: Inbox,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar side="right" collapsible="icon" className="border-l-0">
      <SidebarHeader className="border-b-0 p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative size-12 overflow-hidden rounded-xl shadow-md">
            <Image
              src="/logo.png"
              alt="شعار البلدية"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-lg font-semibold">البلدية</span>
            <span className="text-sm text-muted-foreground">نظام الحجوزات</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-xs font-medium uppercase">القائمة الرئيسية</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className="rounded-full mx-2"
                  >
                    <Link href={item.url}>
                      <item.icon className="size-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t-0 p-4">
        <SidebarMenuButton
          onClick={() => logout()}
          tooltip="تسجيل الخروج"
          className="w-full cursor-pointer rounded-full hover:bg-destructive/10 text-destructive hover:text-destructive"
        >
          <LogOut className="size-5" />
          <span>تسجيل الخروج</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  )
}
