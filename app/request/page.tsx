import { createClient } from "@/lib/supabase/server"
import { BookingRequestForm } from "@/components/booking-requests/booking-request-form"

export default async function RequestPage() {
  const supabase = await createClient()

  const { data: rooms } = await supabase
    .from("rooms")
    .select("id, name, capacity")
    .eq("is_active", true)
    .order("name")

  return (
    <div className="min-h-screen bg-muted/30" dir="rtl">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">طلب حجز قاعة</h1>
          <p className="mt-2 text-muted-foreground">
            أرسل طلبك وسنتواصل معك لتأكيد الحجز والدفع
          </p>
        </div>
        <BookingRequestForm rooms={rooms ?? []} />
      </div>
    </div>
  )
}
