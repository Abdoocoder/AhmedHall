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
import { deleteOrganization } from "@/app/actions/organizations"
import type { Organization } from "@/lib/types"

interface DeleteOrganizationDialogProps {
  organization: Organization
  trigger: React.ReactNode
}

export function DeleteOrganizationDialog({ organization, trigger }: DeleteOrganizationDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    startTransition(async () => {
      try {
        const result = await deleteOrganization(organization.id)
        if (result.error) {
          toast.error(result.error)
          return
        }
        toast.success("تم حذف الجهة بنجاح")
        setOpen(false)
        router.refresh()
      } catch {
        toast.error("حدث خطأ أثناء حذف الجهة")
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
            سيتم حذف جهة "{organization.name}" بشكل نهائي. سيتم أيضاً حذف جميع الحجوزات المرتبطة بها.
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
