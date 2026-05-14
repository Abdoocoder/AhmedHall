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
import type { Booking } from "@/lib/types"
import { formatNabataeanDate } from "@/lib/nabataean-calendar"
import { paymentStatusMap, formatTime } from "@/lib/booking-utils"

interface UpcomingBookingsProps {
  bookings: Booking[]
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
                key={booking._id}
                className="flex items-center justify-between rounded-lg border p-4 transition-[transform,box-shadow] duration-200 ease-out-expo motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-sm"
              >
                <div className="space-y-1">
                  <p className="font-medium">{booking.eventName}</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.organization?.name} - {booking.room?.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatNabataeanDate(booking.bookingDate)} | {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                  </p>
                </div>
                <Badge variant={paymentStatusMap[booking.paymentStatus].variant}>
                  {paymentStatusMap[booking.paymentStatus].label}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
