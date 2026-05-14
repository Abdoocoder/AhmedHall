"use client"

import { useQuery } from "convex/react"
import { OrganizationsTable } from "@/components/organizations/organizations-table"
import { OrganizationDialog } from "@/components/organizations/organization-dialog"
import { api } from "@/convex/_generated/api"

export default function OrganizationsPage() {
  const organizations = useQuery(api.organizations.list) ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">إدارة الجهات</h2>
          <p className="text-muted-foreground">
            إضافة وتعديل الجهات والمؤسسات
          </p>
        </div>
        <OrganizationDialog />
      </div>

      <OrganizationsTable organizations={organizations} />
    </div>
  )
}
