"use client"

import { useEffect } from "react"
import { useQuery } from "convex/react"
import { RequestsTable } from "@/components/booking-requests/requests-table"
import { api } from "@/convex/_generated/api"

export default function RequestsPage() {
  useEffect(() => { document.title = 'طلبات الحجز | نظام حجوزات قاعة البلدية' }, [])
  const requests = useQuery(api.bookingRequests.list) ?? []

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">طلبات الحجز</h2>
        <p className="text-muted-foreground">مراجعة وإدارة طلبات الحجز الواردة من المواطنين</p>
      </div>
      <RequestsTable requests={requests} />
    </div>
  )
}
