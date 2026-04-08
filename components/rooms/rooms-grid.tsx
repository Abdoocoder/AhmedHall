"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Empty } from "@/components/ui/empty"
import { MoreVertical, Users, Building2 } from "lucide-react"
import { RoomDialog } from "./room-dialog"
import { DeleteRoomDialog } from "./delete-room-dialog"
import type { Room } from "@/lib/types"

interface RoomsGridProps {
  rooms: Room[]
}

export function RoomsGrid({ rooms }: RoomsGridProps) {
  if (rooms.length === 0) {
    return (
      <Empty
        icon={Building2}
        title="لا توجد قاعات"
        description="لم يتم إضافة أي قاعات بعد. أضف قاعة جديدة للبدء."
      />
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <Card key={room.id}>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-lg">{room.name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <Users className="size-3" />
                سعة {room.capacity} شخص
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={room.is_active ? "default" : "secondary"}>
                {room.is_active ? "نشط" : "غير نشط"}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <RoomDialog
                    room={room}
                    trigger={
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        تعديل
                      </DropdownMenuItem>
                    }
                  />
                  <DeleteRoomDialog
                    room={room}
                    trigger={
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="text-destructive"
                      >
                        حذف
                      </DropdownMenuItem>
                    }
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {room.description || "لا يوجد وصف"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
