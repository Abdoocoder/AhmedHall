"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
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
import { api } from "@/convex/_generated/api"
import type { Booking, Room, Organization } from "@/lib/types"

const bookingSchema = z.object({
  orgId: z.string().min(1, "يرجى اختيار الجهة"),
  roomId: z.string().min(1, "يرجى اختيار القاعة"),
  bookingDate: z.string().min(1, "يرجى تحديد التاريخ"),
  startTime: z.string().min(1, "يرجى تحديد وقت البداية"),
  endTime: z.string().min(1, "يرجى تحديد وقت النهاية"),
  eventName: z.string().min(1, "يرجى إدخال اسم الفعالية"),
  coordinatorName: z.string().min(1, "يرجى إدخال اسم المنسق"),
  coordinatorPhone: z.string().optional(),
  attendeesCount: z.coerce.number().min(0).optional(),
  paymentStatus: z.enum(["pending", "paid", "cancelled"]),
  notes: z.string().optional(),
})

type BookingFormValues = z.infer<typeof bookingSchema>

interface BookingDialogProps {
  booking?: Booking
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
  const [isPending, setIsPending] = useState(false)
  const createBooking = useMutation(api.bookings.create)
  const updateBooking = useMutation(api.bookings.update)

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      orgId: booking?.orgId ?? "",
      roomId: booking?.roomId ?? "",
      bookingDate: booking?.bookingDate ?? "",
      startTime: booking?.startTime?.slice(0, 5) ?? "",
      endTime: booking?.endTime?.slice(0, 5) ?? "",
      eventName: booking?.eventName ?? "",
      coordinatorName: booking?.coordinatorName ?? "",
      coordinatorPhone: booking?.coordinatorPhone ?? "",
      attendeesCount: booking?.attendeesCount ?? 0,
      paymentStatus: booking?.paymentStatus ?? "pending",
      notes: booking?.notes ?? "",
    },
  })

  async function onSubmit(data: BookingFormValues) {
    setIsPending(true)
    try {
      if (booking) {
        await updateBooking({ id: booking._id as any, ...data } as any)
        toast.success("تم تحديث الحجز بنجاح")
      } else {
        await createBooking({ ...data, attendeesCount: data.attendeesCount ?? 0 } as any)
        toast.success("تم إنشاء الحجز بنجاح")
      }
      setOpen(false)
      form.reset()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "حدث خطأ أثناء حفظ الحجز"
      toast.error(message)
    } finally {
      setIsPending(false)
    }
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
                name="orgId"
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
                          <SelectItem key={org._id} value={org._id}>
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
                name="roomId"
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
                          <SelectItem key={room._id} value={room._id}>
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
              name="eventName"
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
                name="bookingDate"
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
                name="startTime"
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
                name="endTime"
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
                name="coordinatorName"
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
                name="coordinatorPhone"
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
                name="attendeesCount"
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
                name="paymentStatus"
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
