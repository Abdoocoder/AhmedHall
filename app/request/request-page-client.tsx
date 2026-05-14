"use client"

import { useQuery } from "convex/react"
import { BookingRequestForm } from "@/components/booking-requests/booking-request-form"
import { api } from "@/convex/_generated/api"

export function RequestPageClient() {
  const rooms = useQuery(api.rooms.listActive)
  const availableRooms = rooms ?? []

  return (
    <div className="min-h-screen bg-muted/30" dir="rtl">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">طلب حجز قاعة</h1>
          <p className="mt-2 text-muted-foreground">
            أرسل طلبك وسنتواصل معك لتأكيد الحجز والدفع
          </p>
        </div>
        {rooms === undefined ? (
          <div className="text-center py-8 text-muted-foreground">جاري التحميل...</div>
        ) : (
          <BookingRequestForm rooms={availableRooms} />
        )}
      </div>
    </div>
  )
}
