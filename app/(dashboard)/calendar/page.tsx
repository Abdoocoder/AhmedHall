"use client"

import { useEffect } from "react"
import { useQuery } from "convex/react"
import { BookingCalendar } from "@/components/calendar/booking-calendar"
import { api } from "@/convex/_generated/api"

export default function CalendarPage() {
  useEffect(() => { document.title = 'التقويم | نظام حجوزات قاعة البلدية' }, [])
  const bookings = useQuery(api.bookings.list) ?? []
  const rooms = useQuery(api.rooms.listActive) ?? []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">التقويم</h2>
        <p className="text-muted-foreground">
          عرض الحجوزات على التقويم
        </p>
      </div>

      <BookingCalendar bookings={bookings} rooms={rooms} />
    </div>
  )
}
