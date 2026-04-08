"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface RoomData {
  name: string
  capacity: number
  description?: string
  is_active: boolean
}

export async function createRoom(data: RoomData) {
  const supabase = await createClient()

  const { error } = await supabase.from("rooms").insert({
    name: data.name,
    capacity: data.capacity,
    description: data.description || null,
    is_active: data.is_active,
  })

  if (error) {
    return { error: "حدث خطأ أثناء إنشاء القاعة" }
  }

  revalidatePath("/rooms")
  revalidatePath("/bookings")
  return { success: true }
}

export async function updateRoom(id: string, data: RoomData) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("rooms")
    .update({
      name: data.name,
      capacity: data.capacity,
      description: data.description || null,
      is_active: data.is_active,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    return { error: "حدث خطأ أثناء تحديث القاعة" }
  }

  revalidatePath("/rooms")
  revalidatePath("/bookings")
  return { success: true }
}

export async function deleteRoom(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("rooms").delete().eq("id", id)

  if (error) {
    return { error: "حدث خطأ أثناء حذف القاعة" }
  }

  revalidatePath("/rooms")
  revalidatePath("/bookings")
  return { success: true }
}
