"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useClerk } from "@clerk/nextjs"
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Building2,
  Users,
  LogOut,
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
  const router = useRouter()
  const { signOut } = useClerk()

  return (
    <Sidebar side="right" collapsible="icon" className="border-l-0">
      <SidebarHeader className="border-b-0 p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative size-12 overflow-hidden rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
            <Image
              src="/logo.png"
              alt="شعار البلدية"
              fill
              className="object-contain"
              sizes="48px"
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
          onClick={() => signOut({ redirectUrl: "/auth/login" })}
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
