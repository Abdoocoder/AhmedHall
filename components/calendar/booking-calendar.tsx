"use client"

import { useState, useMemo, useEffect } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { BookingWithRelations, Room } from "@/lib/types"
import { formatNabataeanDate, getNabataeanMonthGenitive, formatNabataeanMonthYear } from "@/lib/nabataean-calendar"

interface BookingCalendarProps {
  bookings: BookingWithRelations[]
  rooms: Room[]
}

const roomColors: Record<string, string> = {}
const colorPalette = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#ec4899", // pink
]

function getRoomColor(roomId: string, index: number): string {
  if (!roomColors[roomId]) {
    roomColors[roomId] = colorPalette[index % colorPalette.length]
  }
  return roomColors[roomId]
}

const paymentStatusMap = {
  pending: { label: "قيد الانتظار", variant: "secondary" as const },
  paid: { label: "مدفوع", variant: "default" as const },
  cancelled: { label: "ملغي", variant: "destructive" as const },
}

function formatTime(timeString: string) {
  const [hours, minutes] = timeString.split(":")
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? "م" : "ص"
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}

export function BookingCalendar({ bookings, rooms }: BookingCalendarProps) {
  const [selectedBooking, setSelectedBooking] = useState<BookingWithRelations | null>(null)
  const [filterRoom, setFilterRoom] = useState<string>("all")

  const filteredBookings = useMemo(() => {
    if (filterRoom === "all") return bookings
    return bookings.filter((b) => b.room_id === filterRoom)
  }, [bookings, filterRoom])

  const events = useMemo(() => {
    return filteredBookings.map((booking, index) => {
      const roomIndex = rooms.findIndex((r) => r.id === booking.room_id)
      return {
        id: booking.id,
        title: `${booking.event_name} - ${booking.room?.name}`,
        start: `${booking.booking_date}T${booking.start_time}`,
        end: `${booking.booking_date}T${booking.end_time}`,
        backgroundColor: getRoomColor(booking.room_id, roomIndex >= 0 ? roomIndex : index),
        borderColor: getRoomColor(booking.room_id, roomIndex >= 0 ? roomIndex : index),
        extendedProps: { booking },
      }
    })
  }, [filteredBookings, rooms])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select value={filterRoom} onValueChange={setFilterRoom}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="جميع القاعات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع القاعات</SelectItem>
            {rooms.map((room, index) => (
              <SelectItem key={room.id} value={room.id}>
                <div className="flex items-center gap-2">
                  <div
                    className="size-3 rounded-full"
                    style={{ backgroundColor: getRoomColor(room.id, index) }}
                  />
                  {room.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          direction="rtl"
          headerToolbar={{
            right: "prev,next today",
            center: "title",
            left: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          buttonText={{
            today: "اليوم",
            month: "شهر",
            week: "أسبوع",
            day: "يوم",
          }}
          events={events}
          eventClick={(info) => {
            const booking = info.event.extendedProps.booking as BookingWithRelations
            setSelectedBooking(booking)
          }}
          height="auto"
          eventDisplay="block"
          dayMaxEvents={3}
          moreLinkText={(num) => `+ ${num} المزيد`}
          titleFormat={(date) => {
            const dateObj = new Date(date.date.year, date.date.month - 1, 1)
            return formatNabataeanMonthYear(dateObj)
          }}
        />
      </div>

      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedBooking?.event_name}</DialogTitle>
            <DialogDescription>تفاصيل الحجز</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الجهة:</span>
                  <span className="font-medium">{selectedBooking.organization?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">القاعة:</span>
                  <span className="font-medium">{selectedBooking.room?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">التاريخ:</span>
                  <span className="font-medium">
                    {formatNabataeanDate(selectedBooking.booking_date)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الوقت:</span>
                  <span className="font-medium">
                    {formatTime(selectedBooking.start_time)} - {formatTime(selectedBooking.end_time)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المنسق:</span>
                  <span className="font-medium">{selectedBooking.coordinator_name}</span>
                </div>
                {selectedBooking.coordinator_phone && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الهاتف:</span>
                    <span className="font-medium" dir="ltr">{selectedBooking.coordinator_phone}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">عدد الحضور:</span>
                  <span className="font-medium">{selectedBooking.attendees_count} شخص</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">حالة الدفع:</span>
                  <Badge variant={paymentStatusMap[selectedBooking.payment_status].variant}>
                    {paymentStatusMap[selectedBooking.payment_status].label}
                  </Badge>
                </div>
                {selectedBooking.notes && (
                  <div className="pt-2 border-t">
                    <span className="text-muted-foreground block mb-1">ملاحظات:</span>
                    <p className="text-sm">{selectedBooking.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
