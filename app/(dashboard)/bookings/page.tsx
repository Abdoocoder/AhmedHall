import { createClient } from "@/lib/supabase/server"
import { BookingsTable } from "@/components/bookings/bookings-table"
import { BookingDialog } from "@/components/bookings/booking-dialog"

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  const currentPage = Number(page) || 1
  const pageSize = 10
  const from = (currentPage - 1) * pageSize
  const to = from + pageSize - 1

  const supabase = await createClient()

  const [
    { data: bookings, count: totalCount },
    { data: rooms },
    { data: organizations },
  ] = await Promise.all([
    supabase
      .from("bookings")
      .select(
        `
        *,
        organization:organizations(*),
        room:rooms(*)
      `,
        { count: "exact" }
      )
      .order("booking_date", { ascending: false })
      .range(from, to),
    supabase.from("rooms").select("*").eq("is_active", true).order("name"),
    supabase.from("organizations").select("*").order("name"),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">إدارة الحجوزات</h2>
          <p className="text-muted-foreground">عرض وإدارة جميع حجوزات القاعات</p>
        </div>
        <BookingDialog rooms={rooms ?? []} organizations={organizations ?? []} />
      </div>

      <BookingsTable
        bookings={bookings ?? []}
        rooms={rooms ?? []}
        organizations={organizations ?? []}
        totalCount={totalCount ?? 0}
        currentPage={currentPage}
        pageSize={pageSize}
      />
    </div>
  )
}
