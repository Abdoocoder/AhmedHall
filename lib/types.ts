export type PaymentStatus = 'pending' | 'paid' | 'cancelled'

export interface Organization {
  id: string
  name: string
  contact_person: string | null
  phone: string | null
  email: string | null
  created_at: string
  updated_at: string
}

export interface Room {
  id: string
  name: string
  capacity: number
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  organization_id: string
  room_id: string
  booking_date: string
  start_time: string
  end_time: string
  event_name: string
  coordinator_name: string
  coordinator_phone: string | null
  attendees_count: number
  payment_status: PaymentStatus
  payment_amount: number | null
  payment_date: string | null
  notes: string | null
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface BookingWithRelations extends Booking {
  organization: Organization
  room: Room
}

export interface DashboardStats {
  totalBookingsThisMonth: number
  bookedDaysThisMonth: number
  pendingPayments: number
  totalRooms: number
}
