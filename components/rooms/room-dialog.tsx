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
import { Switch } from "@/components/ui/switch"
import { Spinner } from "@/components/ui/spinner"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import type { Room } from "@/lib/types"

const roomSchema = z.object({
  name: z.string().min(1, "يرجى إدخال اسم القاعة"),
  capacity: z.coerce.number().min(1, "يرجى إدخال السعة"),
  description: z.string().optional(),
  isActive: z.boolean(),
})

type RoomFormValues = z.infer<typeof roomSchema>

interface RoomDialogProps {
  room?: Room
  trigger?: React.ReactNode
}

export function RoomDialog({ room, trigger }: RoomDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const createRoom = useMutation(api.rooms.create)
  const updateRoom = useMutation(api.rooms.update)

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: room?.name ?? "",
      capacity: room?.capacity ?? 50,
      description: room?.description ?? "",
      isActive: room?.isActive ?? true,
    },
  })

  async function onSubmit(data: RoomFormValues) {
    setIsPending(true)
    try {
      if (room) {
        await updateRoom({
          id: room._id as Id<"rooms">,
          name: data.name,
          capacity: data.capacity,
          description: data.description,
          isActive: data.isActive,
        })
        toast.success("تم تحديث القاعة بنجاح")
      } else {
        await createRoom(data)
        toast.success("تم إنشاء القاعة بنجاح")
      }
      setOpen(false)
      form.reset()
    } catch {
      toast.error("حدث خطأ أثناء حفظ القاعة")
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
              name="isActive"
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
