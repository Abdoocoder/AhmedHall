import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function CalendarLoading() {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="space-y-2">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-4 w-48" />
      </div>

      <Skeleton className="h-10 w-48 rounded-md" />

      <Card>
        <CardContent className="p-4 space-y-4">
          {/* Calendar toolbar */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Skeleton className="h-9 w-16 rounded-md" />
              <Skeleton className="h-9 w-20 rounded-md" />
              <Skeleton className="h-9 w-14 rounded-md" />
            </div>
            <Skeleton className="h-6 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-16 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-8 rounded" />
            ))}
          </div>

          {/* Calendar grid */}
          {Array.from({ length: 5 }).map((_, row) => (
            <div key={row} className="grid grid-cols-7 gap-1">
              {Array.from({ length: 7 }).map((_, col) => (
                <Skeleton key={col} className="h-20 rounded" />
              ))}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
