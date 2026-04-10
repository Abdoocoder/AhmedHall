"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
import { submitBookingRequest } from "@/app/actions/booking-requests"

const schema = z.object({
  organization_name: z.string().min(2, "يرجى إدخال اسم الجهة"),
  citizen_name: z.string().min(2, "يرجى إدخال الاسم"),
  citizen_phone: z.string().min(9, "يرجى إدخال رقم هاتف صحيح"),
  citizen_email: z.string().email("بريد إلكتروني غير صحيح").optional().or(z.literal("")),
  event_name: z.string().min(2, "يرجى إدخال اسم الفعالية"),
  room_id: z.string().min(1, "يرجى اختيار القاعة"),
  booking_date: z.string().min(1, "يرجى تحديد التاريخ"),
  start_time: z.string().min(1, "يرجى تحديد وقت البداية"),
  end_time: z.string().min(1, "يرجى تحديد وقت النهاية"),
  attendees_count: z.coerce.number().min(1, "يرجى إدخال عدد الحضور"),
  notes: z.string().optional(),
}).refine(d => d.end_time > d.start_time, {
  message: "وقت النهاية يجب أن يكون بعد وقت البداية",
  path: ["end_time"],
})

type FormValues = z.infer<typeof schema>

interface Room {
  id: string
  name: string
  capacity: number
}

export function BookingRequestForm({ rooms }: { rooms: Room[] }) {
  const [submitted, setSubmitted] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      organization_name: "",
      citizen_name: "",
      citizen_phone: "",
      citizen_email: "",
      event_name: "",
      room_id: "",
      booking_date: "",
      start_time: "",
      end_time: "",
      attendees_count: 1,
      notes: "",
    },
  })

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const result = await submitBookingRequest({
        ...values,
        citizen_email: values.citizen_email || undefined,
        notes: values.notes || undefined,
      })
      if (result.error) {
        toast.error(result.error)
        return
      }
      setSubmitted(true)
    })
  }

  if (submitted) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          <h2 className="text-2xl font-bold">تم إرسال طلبك بنجاح!</h2>
          <p className="text-muted-foreground max-w-sm">
            سيتم مراجعة طلبك من قِبل موظفي البلدية والتواصل معك على رقم الهاتف المُدخل لتأكيد الحجز وترتيب الدفع.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>بيانات الطلب</CardTitle>
        <CardDescription>جميع الحقول المميزة بـ * إلزامية</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            {/* Citizen Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase">بيانات مقدّم الطلب</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="citizen_name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم الكامل *</FormLabel>
                    <FormControl><Input placeholder="محمد أحمد" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="citizen_phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الهاتف *</FormLabel>
                    <FormControl><Input placeholder="07xxxxxxxx" dir="ltr" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="citizen_email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl><Input placeholder="example@email.com" dir="ltr" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="organization_name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم الجهة / المؤسسة *</FormLabel>
                    <FormControl><Input placeholder="مدرسة / جمعية / شركة..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            {/* Event Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase">بيانات الفعالية</h3>
              <FormField control={form.control} name="event_name" render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم الفعالية *</FormLabel>
                  <FormControl><Input placeholder="حفل تخرج / اجتماع / ورشة عمل..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="room_id" render={({ field }) => (
                  <FormItem>
                    <FormLabel>القاعة المطلوبة *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="اختر القاعة" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {rooms.map(room => (
                          <SelectItem key={room.id} value={room.id}>
                            {room.name} — سعة {room.capacity} شخص
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="attendees_count" render={({ field }) => (
                  <FormItem>
                    <FormLabel>عدد الحضور المتوقع *</FormLabel>
                    <FormControl><Input type="number" min={1} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="booking_date" render={({ field }) => (
                <FormItem>
                  <FormLabel>تاريخ الفعالية *</FormLabel>
                  <FormControl><Input type="date" dir="ltr" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="start_time" render={({ field }) => (
                  <FormItem>
                    <FormLabel>وقت البداية *</FormLabel>
                    <FormControl><Input type="time" dir="ltr" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="end_time" render={({ field }) => (
                  <FormItem>
                    <FormLabel>وقت النهاية *</FormLabel>
                    <FormControl><Input type="time" dir="ltr" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="notes" render={({ field }) => (
                <FormItem>
                  <FormLabel>ملاحظات إضافية</FormLabel>
                  <FormControl><Textarea placeholder="أي متطلبات خاصة..." rows={3} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Spinner className="ml-2" />}
              إرسال الطلب
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
