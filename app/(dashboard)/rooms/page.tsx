"use client"

import { useQuery } from "convex/react"
import { RoomsGrid } from "@/components/rooms/rooms-grid"
import { RoomDialog } from "@/components/rooms/room-dialog"
import { api } from "@/convex/_generated/api"

export default function RoomsPage() {
  const rooms = useQuery(api.rooms.list) ?? []

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

      <RoomsGrid rooms={rooms} />
    </div>
  )
}
