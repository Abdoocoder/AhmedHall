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
import { Switch } from "@/components/ui/switch"
import { Spinner } from "@/components/ui/spinner"
import { createRoom, updateRoom } from "@/app/actions/rooms"
import type { Room } from "@/lib/types"

const roomSchema = z.object({
  name: z.string().min(1, "يرجى إدخال اسم القاعة"),
  capacity: z.coerce.number().min(1, "يرجى إدخال السعة"),
  description: z.string().optional(),
  is_active: z.boolean(),
})

type RoomFormValues = z.infer<typeof roomSchema>

interface RoomDialogProps {
  room?: Room
  trigger?: React.ReactNode
}

export function RoomDialog({ room, trigger }: RoomDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: room?.name ?? "",
      capacity: room?.capacity ?? 50,
      description: room?.description ?? "",
      is_active: room?.is_active ?? true,
    },
  })

  function onSubmit(data: RoomFormValues) {
    startTransition(async () => {
      try {
        if (room) {
          const result = await updateRoom(room.id, data)
          if (result.error) {
            toast.error(result.error)
            return
          }
          toast.success("تم تحديث القاعة بنجاح")
        } else {
          const result = await createRoom(data)
          if (result.error) {
            toast.error(result.error)
            return
          }
          toast.success("تم إنشاء القاعة بنجاح")
        }
        setOpen(false)
        form.reset()
        router.refresh()
      } catch {
        toast.error("حدث خطأ أثناء حفظ القاعة")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="size-4 ml-2" />
            قاعة جديدة
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{room ? "تعديل القاعة" : "قاعة جديدة"}</DialogTitle>
          <DialogDescription>
            {room ? "تعديل بيانات القاعة" : "إضافة قاعة جديدة للنظام"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم القاعة</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: القاعة الكبرى" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>السعة (عدد الأشخاص)</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الوصف</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="وصف القاعة والمرافق المتاحة..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>القاعة نشطة</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      القاعات النشطة فقط تظهر في قائمة الحجز
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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
                {room ? "حفظ التغييرات" : "إنشاء القاعة"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
