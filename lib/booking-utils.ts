export const paymentStatusMap: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  pending: { label: "قيد الانتظار", variant: "secondary" },
  paid: { label: "مدفوع", variant: "default" },
  cancelled: { label: "ملغي", variant: "destructive" },
}

export function formatTime(timeString: string) {
  const [hours, minutes] = timeString.split(":")
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? "م" : "ص"
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}

export const requestStatusMap = {
  pending: { label: "قيد المراجعة", variant: "secondary" as const },
  approved: { label: "مقبول", variant: "default" as const },
  rejected: { label: "مرفوض", variant: "destructive" as const },
}
