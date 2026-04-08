import { createClient } from "@/lib/supabase/server"
import { BookingCalendar } from "@/components/calendar/booking-calendar"

export default async function CalendarPage() {
  const supabase = await createClient()

  const [{ data: bookings }, { data: rooms }] = await Promise.all([
    supabase.from("bookings").select(`
      *,
      organization:organizations(*),
      room:rooms(*)
    `),
    supabase.from("rooms").select("*").eq("is_active", true).order("name"),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">التقويم</h2>
        <p className="text-muted-foreground">
          عرض الحجوزات على التقويم
        </p>
      </div>

      <BookingCalendar bookings={bookings ?? []} rooms={rooms ?? []} />
    </div>
  )
}
