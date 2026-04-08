"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Spinner } from "@/components/ui/spinner"
import { deleteRoom } from "@/app/actions/rooms"
import type { Room } from "@/lib/types"

interface DeleteRoomDialogProps {
  room: Room
  trigger: React.ReactNode
}

export function DeleteRoomDialog({ room, trigger }: DeleteRoomDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    startTransition(async () => {
      try {
        const result = await deleteRoom(room.id)
        if (result.error) {
          toast.error(result.error)
          return
        }
        toast.success("تم حذف القاعة بنجاح")
        setOpen(false)
        router.refresh()
      } catch {
        toast.error("حدث خطأ أثناء حذف القاعة")
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle>
          <AlertDialogDescription>
            سيتم حذف قاعة "{room.name}" بشكل نهائي. سيتم أيضاً حذف جميع الحجوزات المرتبطة بها.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isPending}
          >
            {isPending && <Spinner className="ml-2" />}
            حذف
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
