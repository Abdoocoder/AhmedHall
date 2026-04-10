"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface BookingData {
  organization_id: string
  room_id: string
  booking_date: string
  start_time: string
  end_time: string
  event_name: string
  coordinator_name: string
  coordinator_phone?: string
  attendees_count?: number
  payment_status: "pending" | "paid" | "cancelled"
  notes?: string
}

export async function createBooking(data: BookingData) {
  const supabase = await createClient()

  const { error } = await supabase.from("bookings").insert({
    organization_id: data.organization_id,
    room_id: data.room_id,
    booking_date: data.booking_date,
    start_time: data.start_time,
    end_time: data.end_time,
    event_name: data.event_name,
    coordinator_name: data.coordinator_name,
    coordinator_phone: data.coordinator_phone || null,
    attendees_count: data.attendees_count || 0,
    payment_status: data.payment_status,
    notes: data.notes || null,
  })

  if (error) {
    if (error.message.includes("Booking conflict")) {
      return { error: "يوجد تعارض في الحجز: القاعة محجوزة في هذا الوقت" }
    }
    return { error: "حدث خطأ أثناء إنشاء الحجز" }
  }

  revalidatePath("/bookings")
  revalidatePath("/dashboard")
  revalidatePath("/calendar")
  return { success: true }
}

export async function updateBooking(id: string, data: BookingData) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("bookings")
    .update({
      organization_id: data.organization_id,
      room_id: data.room_id,
      booking_date: data.booking_date,
      start_time: data.start_time,
      end_time: data.end_time,
      event_name: data.event_name,
      coordinator_name: data.coordinator_name,
      coordinator_phone: data.coordinator_phone || null,
      attendees_count: data.attendees_count || 0,
      payment_status: data.payment_status,
      notes: data.notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    if (error.message.includes("Booking conflict")) {
      return { error: "يوجد تعارض في الحجز: القاعة محجوزة في هذا الوقت" }
    }
    return { error: "حدث خطأ أثناء تحديث الحجز" }
  }

  revalidatePath("/bookings")
  revalidatePath("/dashboard")
  revalidatePath("/calendar")
  return { success: true }
}

export async function deleteBooking(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("bookings")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/bookings")
  revalidatePath("/dashboard")
  revalidatePath("/calendar")
  return { success: true }
}
