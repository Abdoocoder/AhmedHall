import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, ClipboardList, AlertCircle, Building2 } from "lucide-react"
import type { DashboardStats } from "@/lib/types"

interface StatsCardsProps {
  stats: DashboardStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "حجوزات الشهر",
      value: stats.totalBookingsThisMonth,
      icon: ClipboardList,
      description: "إجمالي الحجوزات لهذا الشهر",
    },
    {
      title: "أيام محجوزة",
      value: stats.bookedDaysThisMonth,
      icon: CalendarDays,
      description: "عدد الأيام المحجوزة هذا الشهر",
    },
    {
      title: "في انتظار الدفع",
      value: stats.pendingPayments,
      icon: AlertCircle,
      description: "حجوزات لم يتم تسديدها",
    },
    {
      title: "القاعات النشطة",
      value: stats.totalRooms,
      icon: Building2,
      description: "عدد القاعات المتاحة للحجز",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
