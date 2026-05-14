"use client"

import { useQuery } from "convex/react"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { UpcomingBookings } from "@/components/dashboard/upcoming-bookings"
import { formatNabataeanMonthYear } from "@/lib/nabataean-calendar"
import { api } from "@/convex/_generated/api"

export default function DashboardPage() {
  const stats = useQuery(api.bookings.getStats)
  const upcomingBookings = useQuery(api.bookings.listUpcoming)

  const today = new Date()

  return (
    <div className="space-y-8">
      <div className="animate-in-up">
        <h2 className="text-2xl font-bold tracking-tight">لوحة التحكم</h2>
        <p className="text-muted-foreground">
          نظرة عامة على حجوزات القاعات والإحصائيات - {formatNabataeanMonthYear(today)}
        </p>
      </div>

      <div className="animate-in-up stagger-1">
        <StatsCards stats={stats ?? { totalBookingsThisMonth: 0, bookedDaysThisMonth: 0, pendingPayments: 0, totalRooms: 0 }} />
      </div>

      <div className="animate-in-up stagger-2">
        <UpcomingBookings bookings={upcomingBookings ?? []} />
      </div>
    </div>
  )
}
