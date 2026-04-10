"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center" dir="rtl">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">حدث خطأ غير متوقع</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          تعذّر تحميل هذه الصفحة. يرجى المحاولة مجدداً.
        </p>
      </div>
      <Button onClick={reset}>إعادة المحاولة</Button>
    </div>
  )
}
