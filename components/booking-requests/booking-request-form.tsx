"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
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
import { api } from "@/convex/_generated/api"

const schema = z.object({
  organizationName: z.string().min(2, "يرجى إدخال اسم الجهة"),
  citizenName: z.string().min(2, "يرجى إدخال الاسم"),
  citizenPhone: z.string().min(9, "يرجى إدخال رقم هاتف صحيح"),
  citizenEmail: z.string().email("بريد إلكتروني غير صحيح").optional().or(z.literal("")),
  eventName: z.string().min(2, "يرجى إدخال اسم الفعالية"),
  roomId: z.string().min(1, "يرجى اختيار القاعة"),
  bookingDate: z.string().min(1, "يرجى تحديد التاريخ"),
  startTime: z.string().min(1, "يرجى تحديد وقت البداية"),
  endTime: z.string().min(1, "يرجى تحديد وقت النهاية"),
  attendeesCount: z.coerce.number().min(1, "يرجى إدخال عدد الحضور"),
  notes: z.string().optional(),
}).refine(d => d.endTime > d.startTime, {
  message: "وقت النهاية يجب أن يكون بعد وقت البداية",
  path: ["endTime"],
})

type FormValues = z.infer<typeof schema>

export function BookingRequestForm({ rooms }: { rooms: { _id: string; name: string; capacity: number }[] }) {
  const [submitted, setSubmitted] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const submitRequest = useMutation(api.bookingRequests.submit)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      organizationName: "",
      citizenName: "",
      citizenPhone: "",
      citizenEmail: "",
      eventName: "",
      roomId: "",
      bookingDate: "",
      startTime: "",
      endTime: "",
      attendeesCount: 1,
      notes: "",
    },
  })

  async function onSubmit(values: FormValues) {
    setIsPending(true)
    try {
      await submitRequest({
        ...values,
        citizenEmail: values.citizenEmail || undefined,
        notes: values.notes || undefined,
      } as any)
      setSubmitted(true)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "حدث خطأ أثناء إرسال الطلب"
      toast.error(message)
    } finally {
      setIsPending(false)
    }
  }

  if (submitted) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <CheckCircle2 className="h-16 w-16 text-chart-2" />
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
              <h2 className="font-semibold text-sm text-muted-foreground">بيانات مقدّم الطلب</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="citizenName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم الكامل *</FormLabel>
                    <FormControl><Input placeholder="محمد أحمد" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="citizenPhone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الهاتف *</FormLabel>
                    <FormControl><Input placeholder="07xxxxxxxx" dir="ltr" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="citizenEmail" render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl><Input placeholder="example@email.com" dir="ltr" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="organizationName" render={({ field }) => (
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
              <h2 className="font-semibold text-sm text-muted-foreground">بيانات الفعالية</h2>
              <FormField control={form.control} name="eventName" render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم الفعالية *</FormLabel>
                  <FormControl><Input placeholder="حفل تخرج / اجتماع / ورشة عمل..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="roomId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>القاعة المطلوبة *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="اختر القاعة" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {rooms.map(room => (
                          <SelectItem key={room._id} value={room._id}>
                            {room.name} — سعة {room.capacity} شخص
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="attendeesCount" render={({ field }) => (
                  <FormItem>
                    <FormLabel>عدد الحضور المتوقع *</FormLabel>
                    <FormControl><Input type="number" min={1} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="bookingDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>تاريخ الفعالية *</FormLabel>
                  <FormControl><Input type="date" dir="ltr" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="startTime" render={({ field }) => (
                  <FormItem>
                    <FormLabel>وقت البداية *</FormLabel>
                    <FormControl><Input type="time" dir="ltr" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="endTime" render={({ field }) => (
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

            <Button type="submit" className="w-full rounded-full" disabled={isPending}>
              {isPending && <Spinner className="ml-2" />}
              إرسال الطلب
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
