export type PaymentStatus = 'pending' | 'paid' | 'cancelled'

export interface Organization {
  _id: string
  _creationTime: number
  name: string
  contactPerson?: string
  phone?: string
  email?: string
  createdAt: number
  updatedAt: number
}

export interface Room {
  _id: string
  _creationTime: number
  name: string
  capacity: number
  description?: string
  isActive: boolean
  createdAt: number
  updatedAt: number
}

export interface Booking {
  _id: string
  _creationTime: number
  orgId: string
  roomId: string
  bookingDate: string
  startTime: string
  endTime: string
  eventName: string
  coordinatorName: string
  coordinatorPhone?: string
  attendeesCount: number
  paymentStatus: PaymentStatus
  paymentAmount?: number
  paymentDate?: string
  notes?: string
  deletedAt?: number
  createdAt: number
  updatedAt: number
  organization?: Organization | null
  room?: Room | null
}

export type RequestStatus = 'pending' | 'approved' | 'rejected'

export interface BookingRequest {
  _id: string
  _creationTime: number
  eventName: string
  bookingDate: string
  startTime: string
  endTime: string
  attendeesCount: number
  notes?: string
  roomId: string
  room?: Room | null
  citizenName: string
  citizenPhone: string
  citizenEmail?: string
  organizationName: string
  status: RequestStatus
  rejectionReason?: string
  reviewedAt?: number
  createdAt: number
  updatedAt: number
}

export interface DashboardStats {
  totalBookingsThisMonth: number
  bookedDaysThisMonth: number
  pendingPayments: number
  totalRooms: number
}
