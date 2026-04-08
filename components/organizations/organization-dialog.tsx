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
import { Spinner } from "@/components/ui/spinner"
import { createOrganization, updateOrganization } from "@/app/actions/organizations"
import type { Organization } from "@/lib/types"

const organizationSchema = z.object({
  name: z.string().min(1, "يرجى إدخال اسم الجهة"),
  contact_person: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("بريد إلكتروني غير صحيح").optional().or(z.literal("")),
})

type OrganizationFormValues = z.infer<typeof organizationSchema>

interface OrganizationDialogProps {
  organization?: Organization
  trigger?: React.ReactNode
}

export function OrganizationDialog({ organization, trigger }: OrganizationDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: organization?.name ?? "",
      contact_person: organization?.contact_person ?? "",
      phone: organization?.phone ?? "",
      email: organization?.email ?? "",
    },
  })

  function onSubmit(data: OrganizationFormValues) {
    startTransition(async () => {
      try {
        if (organization) {
          const result = await updateOrganization(organization.id, data)
          if (result.error) {
            toast.error(result.error)
            return
          }
          toast.success("تم تحديث الجهة بنجاح")
        } else {
          const result = await createOrganization(data)
          if (result.error) {
            toast.error(result.error)
            return
          }
          toast.success("تم إنشاء الجهة بنجاح")
        }
        setOpen(false)
        form.reset()
        router.refresh()
      } catch {
        toast.error("حدث خطأ أثناء حفظ الجهة")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="size-4 ml-2" />
            جهة جديدة
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{organization ? "تعديل الجهة" : "جهة جديدة"}</DialogTitle>
          <DialogDescription>
            {organization ? "تعديل بيانات الجهة" : "إضافة جهة جديدة للنظام"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم الجهة</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: جمعية الشباب الخيرية" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_person"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الشخص المسؤول</FormLabel>
                  <FormControl>
                    <Input placeholder="اسم الشخص المسؤول" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رقم الهاتف</FormLabel>
                  <FormControl>
                    <Input placeholder="05XXXXXXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="example@email.com" {...field} />
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
                {organization ? "حفظ التغييرات" : "إنشاء الجهة"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
