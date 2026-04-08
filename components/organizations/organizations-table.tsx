"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Empty } from "@/components/ui/empty"
import { MoreHorizontal, Users } from "lucide-react"
import { OrganizationDialog } from "./organization-dialog"
import { DeleteOrganizationDialog } from "./delete-organization-dialog"
import type { Organization } from "@/lib/types"

interface OrganizationsTableProps {
  organizations: Organization[]
}

export function OrganizationsTable({ organizations }: OrganizationsTableProps) {
  if (organizations.length === 0) {
    return (
      <Empty
        icon={Users}
        title="لا توجد جهات"
        description="لم يتم إضافة أي جهات بعد. أضف جهة جديدة للبدء."
      />
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الجهة</TableHead>
            <TableHead>المسؤول</TableHead>
            <TableHead>الهاتف</TableHead>
            <TableHead>البريد الإلكتروني</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizations.map((org) => (
            <TableRow key={org.id}>
              <TableCell className="font-medium">{org.name}</TableCell>
              <TableCell>{org.contact_person || "-"}</TableCell>
              <TableCell dir="ltr" className="text-right">{org.phone || "-"}</TableCell>
              <TableCell dir="ltr" className="text-right">{org.email || "-"}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="size-4" />
                      <span className="sr-only">فتح القائمة</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <OrganizationDialog
                      organization={org}
                      trigger={
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          تعديل
                        </DropdownMenuItem>
                      }
                    />
                    <DeleteOrganizationDialog
                      organization={org}
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
