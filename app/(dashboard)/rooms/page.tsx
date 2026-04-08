import { createClient } from "@/lib/supabase/server"
import { RoomsGrid } from "@/components/rooms/rooms-grid"
import { RoomDialog } from "@/components/rooms/room-dialog"

export default async function RoomsPage() {
  const supabase = await createClient()

  const { data: rooms } = await supabase
    .from("rooms")
    .select("*")
    .order("name")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">إدارة القاعات</h2>
          <p className="text-muted-foreground">
            إضافة وتعديل القاعات المتاحة للحجز
          </p>
        </div>
        <RoomDialog />
      </div>

      <RoomsGrid rooms={rooms ?? []} />
    </div>
  )
}
