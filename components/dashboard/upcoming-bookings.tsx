import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty"
import { CalendarDays } from "lucide-react"
import type { BookingWithRelations } from "@/lib/types"

interface UpcomingBookingsProps {
  bookings: BookingWithRelations[]
}

const paymentStatusMap = {
  pending: { label: "قيد الانتظار", variant: "secondary" as const },
  paid: { label: "مدفوع", variant: "default" as const },
  cancelled: { label: "ملغي", variant: "destructive" as const },
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("ar-SA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function formatTime(timeString: string) {
  const [hours, minutes] = timeString.split(":")
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? "م" : "ص"
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}

export function UpcomingBookings({ bookings }: UpcomingBookingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>الحجوزات القادمة</CardTitle>
        <CardDescription>أقرب 5 حجوزات قادمة</CardDescription>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <Empty className="min-h-[200px]">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CalendarDays />
              </EmptyMedia>
              <EmptyTitle>لا توجد حجوزات قادمة</EmptyTitle>
              <EmptyDescription>لم يتم العثور على أي حجوزات قادمة</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="space-y-1">
                  <p className="font-medium">{booking.event_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.organization?.name} - {booking.room?.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(booking.booking_date)} | {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                  </p>
                </div>
                <Badge variant={paymentStatusMap[booking.payment_status].variant}>
                  {paymentStatusMap[booking.payment_status].label}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
