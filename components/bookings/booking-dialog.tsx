"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { createBooking, updateBooking } from "@/app/actions/bookings"
import type { BookingWithRelations, Room, Organization } from "@/lib/types"

const bookingSchema = z.object({
  organization_id: z.string().min(1, "يرجى اختيار الجهة"),
  room_id: z.string().min(1, "يرجى اختيار القاعة"),
  booking_date: z.string().min(1, "يرجى تحديد التاريخ"),
  start_time: z.string().min(1, "يرجى تحديد وقت البداية"),
  end_time: z.string().min(1, "يرجى تحديد وقت النهاية"),
  event_name: z.string().min(1, "يرجى إدخال اسم الفعالية"),
  coordinator_name: z.string().min(1, "يرجى إدخال اسم المنسق"),
  coordinator_phone: z.string().optional(),
  attendees_count: z.coerce.number().min(0).optional(),
  payment_status: z.enum(["pending", "paid", "cancelled"]),
  notes: z.string().optional(),
})

type BookingFormValues = z.infer<typeof bookingSchema>

interface BookingDialogProps {
  booking?: BookingWithRelations
  rooms: Room[]
  organizations: Organization[]
  trigger?: React.ReactNode
}

export function BookingDialog({
  booking,
  rooms,
  organizations,
  trigger,
}: BookingDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      organization_id: booking?.organization_id ?? "",
      room_id: booking?.room_id ?? "",
      booking_date: booking?.booking_date ?? "",
      start_time: booking?.start_time?.slice(0, 5) ?? "",
      end_time: booking?.end_time?.slice(0, 5) ?? "",
      event_name: booking?.event_name ?? "",
      coordinator_name: booking?.coordinator_name ?? "",
      coordinator_phone: booking?.coordinator_phone ?? "",
      attendees_count: booking?.attendees_count ?? 0,
      payment_status: booking?.payment_status ?? "pending",
      notes: booking?.notes ?? "",
    },
  })

  function onSubmit(data: BookingFormValues) {
    startTransition(async () => {
      try {
        if (booking) {
          const result = await updateBooking(booking.id, data)
          if (result.error) {
            toast.error(result.error)
            return
          }
          toast.success("تم تحديث الحجز بنجاح")
        } else {
          const result = await createBooking(data)
          if (result.error) {
            toast.error(result.error)
            return
          }
          toast.success("تم إنشاء الحجز بنجاح")
        }
        setOpen(false)
        form.reset()
        router.refresh()
      } catch {
        toast.error("حدث خطأ أثناء حفظ الحجز")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="size-4 ml-2" />
            حجز جديد
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{booking ? "تعديل الحجز" : "حجز جديد"}</DialogTitle>
          <DialogDescription>
            {booking ? "تعديل بيانات الحجز" : "إضافة حجز جديد للقاعة"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="organization_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الجهة</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الجهة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {organizations.map((org) => (
                          <SelectItem key={org.id} value={org.id}>
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="room_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>القاعة</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر القاعة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {rooms.map((room) => (
                          <SelectItem key={room.id} value={room.id}>
                            {room.name} ({room.capacity} شخص)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="event_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم الفعالية</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: حفل تكريم" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="booking_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>التاريخ</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>وقت البداية</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>وقت النهاية</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="coordinator_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم المنسق</FormLabel>
                    <FormControl>
                      <Input placeholder="اسم الشخص المسؤول" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coordinator_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>هاتف المنسق</FormLabel>
                    <FormControl>
                      <Input placeholder="05XXXXXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="attendees_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عدد الحضور المتوقع</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="payment_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>حالة الدفع</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">قيد الانتظار</SelectItem>
                        <SelectItem value="paid">مدفوع</SelectItem>
                        <SelectItem value="cancelled">ملغي</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ملاحظات</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="أي ملاحظات إضافية..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Spinner className="ml-2" />}
                {booking ? "حفظ التغييرات" : "إنشاء الحجز"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
