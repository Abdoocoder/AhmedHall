import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  organizations: defineTable({
    name: v.string(),
    contactPerson: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  rooms: defineTable({
    name: v.string(),
    capacity: v.number(),
    description: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_active", ["isActive"]),

  bookings: defineTable({
    orgId: v.id("organizations"),
    roomId: v.id("rooms"),
    bookingDate: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    eventName: v.string(),
    coordinatorName: v.string(),
    coordinatorPhone: v.optional(v.string()),
    attendeesCount: v.number(),
    paymentStatus: v.union(v.literal("pending"), v.literal("paid"), v.literal("cancelled")),
    paymentAmount: v.optional(v.number()),
    paymentDate: v.optional(v.string()),
    notes: v.optional(v.string()),
    deletedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_room_date", ["roomId", "bookingDate"])
    .index("by_org", ["orgId"])
    .index("by_date", ["bookingDate"]),

  bookingRequests: defineTable({
    eventName: v.string(),
    bookingDate: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    attendeesCount: v.number(),
    notes: v.optional(v.string()),
    roomId: v.id("rooms"),
    citizenName: v.string(),
    citizenPhone: v.string(),
    citizenEmail: v.optional(v.string()),
    organizationName: v.string(),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
    rejectionReason: v.optional(v.string()),
    reviewedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_date", ["createdAt"]),

  userRoles: defineTable({
    userId: v.string(),
    role: v.union(v.literal("admin"), v.literal("manager"), v.literal("user")),
  }).index("by_userId", ["userId"]),
});
