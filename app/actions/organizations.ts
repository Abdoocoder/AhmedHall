"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface OrganizationData {
  name: string
  contact_person?: string
  phone?: string
  email?: string
}

export async function createOrganization(data: OrganizationData) {
  const supabase = await createClient()

  const { error } = await supabase.from("organizations").insert({
    name: data.name,
    contact_person: data.contact_person || null,
    phone: data.phone || null,
    email: data.email || null,
  })

  if (error) {
    return { error: "حدث خطأ أثناء إنشاء الجهة" }
  }

  revalidatePath("/organizations")
  revalidatePath("/bookings")
  return { success: true }
}

export async function updateOrganization(id: string, data: OrganizationData) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("organizations")
    .update({
      name: data.name,
      contact_person: data.contact_person || null,
      phone: data.phone || null,
      email: data.email || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    return { error: "حدث خطأ أثناء تحديث الجهة" }
  }

  revalidatePath("/organizations")
  revalidatePath("/bookings")
  return { success: true }
}

export async function deleteOrganization(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("organizations").delete().eq("id", id)

  if (error) {
    return { error: "حدث خطأ أثناء حذف الجهة" }
  }

  revalidatePath("/organizations")
  revalidatePath("/bookings")
  return { success: true }
}
