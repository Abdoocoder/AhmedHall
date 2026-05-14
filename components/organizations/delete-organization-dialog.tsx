"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
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
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import type { Organization } from "@/lib/types"

interface DeleteOrganizationDialogProps {
  organization: Organization
  trigger: React.ReactNode
}

export function DeleteOrganizationDialog({ organization, trigger }: DeleteOrganizationDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const deleteOrganization = useMutation(api.organizations.remove)

  async function handleDelete() {
    setIsPending(true)
    try {
      await deleteOrganization({ id: organization._id as Id<"organizations"> })
      toast.success("تم حذف الجهة بنجاح")
      setOpen(false)
    } catch {
      toast.error("حدث خطأ أثناء حذف الجهة")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle>
          <AlertDialogDescription>
            سيتم حذف جهة &ldquo;{organization.name}&rdquo; بشكل نهائي. سيتم أيضاً حذف جميع الحجوزات المرتبطة بها.
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
