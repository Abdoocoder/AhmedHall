"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
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
import { api } from "@/convex/_generated/api"
import { formatNabataeanDate } from "@/lib/nabataean-calendar"
import type { BookingRequest } from "@/lib/types"

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

export function RequestsTable({ requests }: { requests: BookingRequest[] }) {
  const [selected, setSelected] = useState<BookingRequest | null>(null)
  const [rejectDialog, setRejectDialog] = useState<BookingRequest | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [isPending, setIsPending] = useState(false)
  const approveRequest = useMutation(api.bookingRequests.approve)
  const rejectRequest = useMutation(api.bookingRequests.reject)

  async function handleApprove(req: BookingRequest) {
    setIsPending(true)
    try {
      await approveRequest({ id: req._id as any })
      toast.success("تم قبول الطلب وإنشاء الحجز")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "حدث خطأ أثناء قبول الطلب"
      toast.error(message)
    } finally {
      setIsPending(false)
    }
  }

  async function handleReject() {
    if (!rejectDialog) return
    setIsPending(true)
    try {
      await rejectRequest({ id: rejectDialog._id as any, reason: rejectReason || undefined })
      toast.success("تم رفض الطلب")
      setRejectDialog(null)
      setRejectReason("")
    } catch {
      toast.error("حدث خطأ أثناء رفض الطلب")
    } finally {
      setIsPending(false)
    }
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
            <Card key={req._id} className="transition-[transform,box-shadow] duration-200 ease-out-expo motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{req.eventName}</span>
                      <Badge variant={status.variant} className="gap-1">
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {req.organizationName} — {req.room?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatNabataeanDate(req.bookingDate)} | {formatTime(req.startTime)} - {formatTime(req.endTime)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {req.citizenName} — {req.citizenPhone}
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
            <DialogTitle>{selected?.eventName}</DialogTitle>
            <DialogDescription>تفاصيل طلب الحجز</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="grid gap-2 text-sm" dir="rtl">
              {[
                ["الجهة",         selected.organizationName],
                ["القاعة",        selected.room?.name],
                ["التاريخ",       formatNabataeanDate(selected.bookingDate)],
                ["الوقت",         `${formatTime(selected.startTime)} - ${formatTime(selected.endTime)}`],
                ["عدد الحضور",    `${selected.attendeesCount} شخص`],
                ["مقدّم الطلب",   selected.citizenName],
                ["الهاتف",        selected.citizenPhone],
                ["البريد",        selected.citizenEmail ?? "—"],
                ["الحالة",        statusMap[selected.status].label],
                ...(selected.rejectionReason ? [["سبب الرفض", selected.rejectionReason]] : []),
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
