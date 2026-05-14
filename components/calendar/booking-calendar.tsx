"use client"

import { useState, useMemo } from "react"
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
import type { Booking, Room } from "@/lib/types"
import { formatNabataeanDate, formatNabataeanMonthYear } from "@/lib/nabataean-calendar"

interface BookingCalendarProps {
  bookings: Booking[]
  rooms: Room[]
}

const roomColors: Record<string, string> = {}
const colorPalette = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--primary)",
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
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [filterRoom, setFilterRoom] = useState<string>("all")

  const filteredBookings = useMemo(() => {
    if (filterRoom === "all") return bookings
    return bookings.filter((b) => b.roomId === filterRoom)
  }, [bookings, filterRoom])

  const events = useMemo(() => {
    return filteredBookings.map((booking, index) => {
      const roomIndex = rooms.findIndex((r) => r._id === booking.roomId)
      return {
        id: booking._id,
        title: `${booking.eventName} - ${booking.room?.name}`,
        start: `${booking.bookingDate}T${booking.startTime}`,
        end: `${booking.bookingDate}T${booking.endTime}`,
        backgroundColor: getRoomColor(booking.roomId, roomIndex >= 0 ? roomIndex : index),
        borderColor: getRoomColor(booking.roomId, roomIndex >= 0 ? roomIndex : index),
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
              <SelectItem key={room._id} value={room._id}>
                <div className="flex items-center gap-2">
                  <div
                    className="size-3 rounded-full"
                    style={{ backgroundColor: getRoomColor(room._id, index) }}
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
            const booking = info.event.extendedProps.booking as Booking
            setSelectedBooking(booking)
          }}
          height="auto"
          eventDisplay="block"
          dayMaxEvents={3}
          moreLinkText={(num) => `+ ${num} المزيد`}
          titleFormat={(date) => {
            const dateObj = new Date(date.date.year, date.date.month, 1)
            return formatNabataeanMonthYear(dateObj)
          }}
        />
      </div>

      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedBooking?.eventName}</DialogTitle>
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
                    {formatNabataeanDate(selectedBooking.bookingDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الوقت:</span>
                  <span className="font-medium">
                    {formatTime(selectedBooking.startTime)} - {formatTime(selectedBooking.endTime)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المنسق:</span>
                  <span className="font-medium">{selectedBooking.coordinatorName}</span>
                </div>
                {selectedBooking.coordinatorPhone && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الهاتف:</span>
                    <span className="font-medium" dir="ltr">{selectedBooking.coordinatorPhone}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">عدد الحضور:</span>
                  <span className="font-medium">{selectedBooking.attendeesCount} شخص</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">حالة الدفع:</span>
                  <Badge variant={paymentStatusMap[selectedBooking.paymentStatus].variant}>
                    {paymentStatusMap[selectedBooking.paymentStatus].label}
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
