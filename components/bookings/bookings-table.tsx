"use client"

import { useState, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MoreHorizontal, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { BookingDialog } from "./booking-dialog"
import { DeleteBookingDialog } from "./delete-booking-dialog"
import type { BookingWithRelations, Room, Organization } from "@/lib/types"
import { formatNabataeanDate } from "@/lib/nabataean-calendar"

interface BookingsTableProps {
  bookings: BookingWithRelations[]
  rooms: Room[]
  organizations: Organization[]
  totalCount: number
  currentPage: number
  pageSize: number
}

const paymentStatusMap = {
  pending: { label: "قيد الانتظار", variant: "secondary" as const },
  paid: { label: "مدفوع", variant: "default" as const },
  cancelled: { label: "ملغي", variant: "destructive" as const },
}

function formatDate(dateString: string) {
  return formatNabataeanDate(dateString)
}

function formatTime(timeString: string) {
  const [hours, minutes] = timeString.split(":")
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? "م" : "ص"
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}

export function BookingsTable({
  bookings,
  rooms,
  organizations,
  totalCount,
  currentPage,
  pageSize,
}: BookingsTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  const totalPages = Math.ceil(totalCount / pageSize)

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    router.push(`?${params.toString()}`)
  }

  const columns = useMemo<ColumnDef<BookingWithRelations>[]>(
    () => [
      {
        accessorKey: "event_name",
        header: "الفعالية",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.event_name}</p>
            <p className="text-sm text-muted-foreground">
              {row.original.coordinator_name}
            </p>
          </div>
        ),
      },
      {
        id: "organization_name",
        accessorKey: "organization.name",
        header: "الجهة",
        cell: ({ row }) => row.original.organization?.name ?? "-",
      },
      {
        id: "room_name",
        accessorKey: "room.name",
        header: "القاعة",
        cell: ({ row }) => row.original.room?.name ?? "-",
        filterFn: (row, _, filterValue) => {
          if (!filterValue || filterValue === "all") return true
          return row.original.room_id === filterValue
        },
      },
      {
        accessorKey: "booking_date",
        header: "التاريخ",
        cell: ({ row }) => formatDate(row.original.booking_date),
      },
      {
        accessorKey: "start_time",
        header: "الوقت",
        cell: ({ row }) => (
          <span>
            {formatTime(row.original.start_time)} - {formatTime(row.original.end_time)}
          </span>
        ),
      },
      {
        accessorKey: "payment_status",
        header: "الدفع",
        cell: ({ row }) => (
          <Badge variant={paymentStatusMap[row.original.payment_status].variant}>
            {paymentStatusMap[row.original.payment_status].label}
          </Badge>
        ),
        filterFn: (row, _, filterValue) => {
          if (!filterValue || filterValue === "all") return true
          return row.original.payment_status === filterValue
        },
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">فتح القائمة</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <BookingDialog
                booking={row.original}
                rooms={rooms}
                organizations={organizations}
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    تعديل
                  </DropdownMenuItem>
                }
              />
              <DeleteBookingDialog
                booking={row.original}
                trigger={
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="text-destructive"
                  >
                    حذف
                  </DropdownMenuItem>
                }
              />
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [rooms, organizations]
  )

  const table = useReactTable({
    data: bookings,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="بحث..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pr-9"
          />
        </div>
        <Select
          value={(table.getColumn("room_name")?.getFilterValue() as string) ?? "all"}
          onValueChange={(value) =>
            table.getColumn("room_name")?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="جميع القاعات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع القاعات</SelectItem>
            {rooms.map((room) => (
              <SelectItem key={room.id} value={room.id}>
                {room.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={(table.getColumn("payment_status")?.getFilterValue() as string) ?? "all"}
          onValueChange={(value) =>
            table.getColumn("payment_status")?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="حالة الدفع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="pending">قيد الانتظار</SelectItem>
            <SelectItem value="paid">مدفوع</SelectItem>
            <SelectItem value="cancelled">ملغي</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  لا توجد حجوزات
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          عرض {Math.min((currentPage - 1) * pageSize + 1, totalCount)} -{" "}
          {Math.min(currentPage * pageSize, totalCount)} من {totalCount} حجز
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronRight className="size-4" />
            السابق
          </Button>
          <div className="text-sm font-medium">
            صفحة {currentPage} من {totalPages || 1}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            التالي
            <ChevronLeft className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
