import { createClient } from "@/lib/supabase/server"
import { RequestsTable } from "@/components/booking-requests/requests-table"

export default async function RequestsPage() {
  const supabase = await createClient()

  const { data: requests } = await supabase
    .from("booking_requests")
    .select("*, room:rooms(id, name, capacity)")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">طلبات الحجز</h2>
        <p className="text-muted-foreground">مراجعة وإدارة طلبات الحجز الواردة من المواطنين</p>
      </div>
      <RequestsTable requests={requests ?? []} />
    </div>
  )
}
