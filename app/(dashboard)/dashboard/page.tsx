import { createClient } from "@/lib/supabase/server"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { UpcomingBookings } from "@/components/dashboard/upcoming-bookings"
import { formatNabataeanMonthYear } from "@/lib/nabataean-calendar"

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const today = new Date()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  // Get stats
  const [
    { count: totalBookingsThisMonth },
    { data: bookedDays },
    { count: pendingPayments },
    { count: totalRooms },
  ] = await Promise.all([
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .is("deleted_at", null)
      .gte("booking_date", firstDayOfMonth.toISOString().split("T")[0])
      .lte("booking_date", lastDayOfMonth.toISOString().split("T")[0]),
    supabase
      .from("bookings")
      .select("booking_date")
      .is("deleted_at", null)
      .gte("booking_date", firstDayOfMonth.toISOString().split("T")[0])
      .lte("booking_date", lastDayOfMonth.toISOString().split("T")[0]),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .is("deleted_at", null)
      .eq("payment_status", "pending"),
    supabase
      .from("rooms")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
  ])

  const uniqueBookedDays = new Set(bookedDays?.map((b) => b.booking_date)).size

  // Get upcoming bookings
  const { data: upcomingBookings } = await supabase
    .from("bookings")
    .select(`
      *,
      organization:organizations(*),
      room:rooms(*)
    `)
    .is("deleted_at", null)
    .gte("booking_date", today.toISOString().split("T")[0])
    .order("booking_date", { ascending: true })
    .order("start_time", { ascending: true })
    .limit(5)

  const stats = {
    totalBookingsThisMonth: totalBookingsThisMonth ?? 0,
    bookedDaysThisMonth: uniqueBookedDays,
    pendingPayments: pendingPayments ?? 0,
    totalRooms: totalRooms ?? 0,
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">لوحة التحكم</h2>
        <p className="text-muted-foreground">
          نظرة عامة على حجوزات القاعات والإحصائيات - {formatNabataeanMonthYear(today)}
        </p>
      </div>

      <StatsCards stats={stats} />
      
      <UpcomingBookings bookings={upcomingBookings ?? []} />
    </div>
  )
}
