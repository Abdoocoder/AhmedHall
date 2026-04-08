import { createClient } from "@/lib/supabase/server"
import { OrganizationsTable } from "@/components/organizations/organizations-table"
import { OrganizationDialog } from "@/components/organizations/organization-dialog"

export default async function OrganizationsPage() {
  const supabase = await createClient()

  const { data: organizations } = await supabase
    .from("organizations")
    .select("*")
    .order("name")

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

      <OrganizationsTable organizations={organizations ?? []} />
    </div>
  )
}
