"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { CheckCircle, XCircle, Clock, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "@/components/ui/empty"
import { approveBookingRequest, rejectBookingRequest } from "@/app/actions/booking-requests"
import { formatNabataeanDate } from "@/lib/nabataean-calendar"
import type { BookingRequestWithRoom } from "@/lib/types"

const statusMap = {
  pending:  { label: "قيد المراجعة", variant: "secondary" as const, icon: Clock },
  approved: { label: "مقبول",         variant: "default"   as const, icon: CheckCircle },
  rejected: { label: "مرفوض",         variant: "destructive" as const, icon: XCircle },
}

function formatTime(t: string) {
  const [h, m] = t.split(":")
  const hour = parseInt(h)
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? "م" : "ص"}`
}

export function RequestsTable({ requests }: { requests: BookingRequestWithRoom[] }) {
  const [selected, setSelected] = useState<BookingRequestWithRoom | null>(null)
  const [rejectDialog, setRejectDialog] = useState<BookingRequestWithRoom | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleApprove(req: BookingRequestWithRoom) {
    startTransition(async () => {
      const result = await approveBookingRequest(req.id)
      if (result.error) { toast.error(result.error); return }
      toast.success("تم قبول الطلب وإنشاء الحجز")
      router.refresh()
    })
  }

  function handleReject() {
    if (!rejectDialog) return
    startTransition(async () => {
      const result = await rejectBookingRequest(rejectDialog.id, rejectReason)
      if (result.error) { toast.error(result.error); return }
      toast.success("تم رفض الطلب")
      setRejectDialog(null)
      setRejectReason("")
      router.refresh()
    })
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon"><Clock /></EmptyMedia>
              <EmptyTitle>لا توجد طلبات</EmptyTitle>
              <EmptyDescription>لم يتم استلام أي طلبات حجز حتى الآن</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {requests.map(req => {
          const status = statusMap[req.status]
          const StatusIcon = status.icon
          return (
            <Card key={req.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{req.event_name}</span>
                      <Badge variant={status.variant} className="gap-1">
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {req.organization_name} — {req.room?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatNabataeanDate(req.booking_date)} | {formatTime(req.start_time)} - {formatTime(req.end_time)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {req.citizen_name} — {req.citizen_phone}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button variant="outline" size="sm" onClick={() => setSelected(req)}>
                      <Eye className="h-4 w-4 ml-1" />
                      التفاصيل
                    </Button>
                    {req.status === "pending" && (
                      <>
                        <Button size="sm" onClick={() => handleApprove(req)} disabled={isPending}>
                          {isPending ? <Spinner className="h-4 w-4" /> : <CheckCircle className="h-4 w-4 ml-1" />}
                          قبول
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => setRejectDialog(req)} disabled={isPending}>
                          <XCircle className="h-4 w-4 ml-1" />
                          رفض
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Details Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.event_name}</DialogTitle>
            <DialogDescription>تفاصيل طلب الحجز</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="grid gap-2 text-sm" dir="rtl">
              {[
                ["الجهة",         selected.organization_name],
                ["القاعة",        selected.room?.name],
                ["التاريخ",       formatNabataeanDate(selected.booking_date)],
                ["الوقت",         `${formatTime(selected.start_time)} - ${formatTime(selected.end_time)}`],
                ["عدد الحضور",    `${selected.attendees_count} شخص`],
                ["مقدّم الطلب",   selected.citizen_name],
                ["الهاتف",        selected.citizen_phone],
                ["البريد",        selected.citizen_email ?? "—"],
                ["الحالة",        statusMap[selected.status].label],
                ...(selected.rejection_reason ? [["سبب الرفض", selected.rejection_reason]] : []),
                ...(selected.notes ? [["ملاحظات", selected.notes]] : []),
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between border-b pb-1 last:border-0">
                  <span className="text-muted-foreground">{label}:</span>
                  <span className="font-medium text-left">{value}</span>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={!!rejectDialog} onOpenChange={() => { setRejectDialog(null); setRejectReason("") }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>رفض الطلب</DialogTitle>
            <DialogDescription>يمكنك إدخال سبب الرفض لإعلام المواطن</DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="سبب الرفض (اختياري)..."
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
            rows={3}
            dir="rtl"
          />
          <DialogFooter className="gap-2" dir="rtl">
            <Button variant="outline" onClick={() => setRejectDialog(null)}>إلغاء</Button>
            <Button variant="destructive" onClick={handleReject} disabled={isPending}>
              {isPending && <Spinner className="ml-2" />}
              تأكيد الرفض
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
