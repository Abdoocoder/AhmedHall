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
import { deleteBooking } from "@/app/actions/bookings"
import type { Booking } from "@/lib/types"

interface DeleteBookingDialogProps {
  booking: Booking
  trigger: React.ReactNode
}

export function DeleteBookingDialog({ booking, trigger }: DeleteBookingDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    startTransition(async () => {
      try {
        const result = await deleteBooking(booking.id)
        if (result.error) {
          toast.error(result.error)
          return
        }
        toast.success("تم حذف الحجز بنجاح")
        setOpen(false)
        router.refresh()
      } catch {
        toast.error("حدث خطأ أثناء حذف الحجز")
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
            سيتم حذف حجز "{booking.event_name}" بشكل نهائي. لا يمكن التراجع عن هذا الإجراء.
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
