"use client"

import { useEffect } from "react"
import { useQuery } from "convex/react"
import { BookingsTable } from "@/components/bookings/bookings-table"
import { BookingDialog } from "@/components/bookings/booking-dialog"
import { api } from "@/convex/_generated/api"

export default function BookingsPage() {
  useEffect(() => { document.title = 'الحجوزات | نظام حجوزات قاعة البلدية' }, [])
  const bookings = useQuery(api.bookings.list) ?? []
  const rooms = useQuery(api.rooms.listActive) ?? []
  const organizations = useQuery(api.organizations.list) ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">إدارة الحجوزات</h2>
          <p className="text-muted-foreground">عرض وإدارة جميع حجوزات القاعات</p>
        </div>
        <BookingDialog rooms={rooms} organizations={organizations} />
      </div>

      <BookingsTable
        bookings={bookings}
        rooms={rooms}
        organizations={organizations}
        totalCount={bookings.length}
        currentPage={1}
        pageSize={10}
      />
    </div>
  )
}
