"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface BookingRequestData {
  event_name: string
  booking_date: string
  start_time: string
  end_time: string
  attendees_count: number
  notes?: string
  room_id: string
  citizen_name: string
  citizen_phone: string
  citizen_email?: string
  organization_name: string
}

export async function submitBookingRequest(data: BookingRequestData) {
  const supabase = await createClient()

  const { error } = await supabase.from("booking_requests").insert({
    event_name: data.event_name,
    booking_date: data.booking_date,
    start_time: data.start_time,
    end_time: data.end_time,
    attendees_count: data.attendees_count || 0,
    notes: data.notes || null,
    room_id: data.room_id,
    citizen_name: data.citizen_name,
    citizen_phone: data.citizen_phone,
    citizen_email: data.citizen_email || null,
    organization_name: data.organization_name,
  })

  if (error) {
    console.error("submitBookingRequest error:", error)
    return { error: "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مجدداً." }
  }

  return { success: true }
}

export async function approveBookingRequest(id: string) {
  const supabase = await createClient()

  // Fetch request details first
  const { data: request, error: fetchError } = await supabase
    .from("booking_requests")
    .select("*, room:rooms(*)")
    .eq("id", id)
    .single()

  if (fetchError || !request) {
    return { error: "لم يتم العثور على الطلب" }
  }

  // Check for booking conflict
  const { data: conflict } = await supabase
    .from("bookings")
    .select("id")
    .eq("room_id", request.room_id)
    .eq("booking_date", request.booking_date)
    .is("deleted_at", null)
    .lt("start_time", request.end_time)
    .gt("end_time", request.start_time)
    .limit(1)

  if (conflict && conflict.length > 0) {
    return { error: "يوجد تعارض في الحجز: القاعة محجوزة في هذا الوقت" }
  }

  // Find or create organization by name
  let organizationId: string
  const { data: existingOrg } = await supabase
    .from("organizations")
    .select("id")
    .eq("name", request.organization_name)
    .single()

  if (existingOrg) {
    organizationId = existingOrg.id
  } else {
    const { data: newOrg, error: orgError } = await supabase
      .from("organizations")
      .insert({ name: request.organization_name, contact_person: request.citizen_name, phone: request.citizen_phone })
      .select("id")
      .single()
    if (orgError || !newOrg) {
      return { error: "حدث خطأ أثناء إنشاء الجهة" }
    }
    organizationId = newOrg.id
  }

  // Create booking from request
  const { error: bookingError } = await supabase.from("bookings").insert({
    organization_id: organizationId,
    room_id: request.room_id,
    booking_date: request.booking_date,
    start_time: request.start_time,
    end_time: request.end_time,
    event_name: request.event_name,
    coordinator_name: request.citizen_name,
    coordinator_phone: request.citizen_phone,
    attendees_count: request.attendees_count,
    payment_status: "pending",
    notes: request.notes || null,
  })

  if (bookingError) {
    console.error("approveBookingRequest booking error:", bookingError)
    return { error: "حدث خطأ أثناء إنشاء الحجز" }
  }

  // Update request status
  const { error: updateError } = await supabase
    .from("booking_requests")
    .update({ status: "approved", reviewed_at: new Date().toISOString() })
    .eq("id", id)

  if (updateError) {
    console.error("approveBookingRequest update error:", updateError)
    return { error: "تم إنشاء الحجز لكن حدث خطأ في تحديث حالة الطلب" }
  }

  revalidatePath("/requests")
  revalidatePath("/bookings")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function rejectBookingRequest(id: string, reason: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("booking_requests")
    .update({
      status: "rejected",
      rejection_reason: reason || null,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("rejectBookingRequest error:", error)
    return { error: "حدث خطأ أثناء رفض الطلب" }
  }

  revalidatePath("/requests")
  return { success: true }
}
