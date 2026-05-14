import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const bookings = await ctx.db
      .query("bookings")
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();

    const withRelations = await Promise.all(
      bookings.map(async (booking) => {
        const org = await ctx.db.get(booking.orgId);
        const room = await ctx.db.get(booking.roomId);
        return { ...booking, organization: org, room };
      })
    );
    return withRelations;
  },
});

export const listByRoomAndDate = query({
  args: { roomId: v.id("rooms"), date: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bookings")
      .withIndex("by_room_date", (q) =>
        q.eq("roomId", args.roomId).eq("bookingDate", args.date)
      )
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();
  },
});

export const listUpcoming = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_date", (q) => q.gte("bookingDate", today))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .take(10);

    const withRelations = await Promise.all(
      bookings.map(async (booking) => {
        const org = await ctx.db.get(booking.orgId);
        const room = await ctx.db.get(booking.roomId);
        return { ...booking, organization: org, room };
      })
    );
    return withRelations;
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0];
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split("T")[0];

    const allBookings = await ctx.db
      .query("bookings")
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();

    const monthBookings = allBookings.filter(
      (b) => b.bookingDate >= firstDayOfMonth && b.bookingDate <= lastDayOfMonth
    );
    const uniqueDays = new Set(monthBookings.map((b) => b.bookingDate)).size;
    const pendingPayments = allBookings.filter((b) => b.paymentStatus === "pending").length;

    const rooms = await ctx.db.query("rooms").collect();
    const activeRooms = rooms.filter((r) => r.isActive).length;

    return {
      totalBookingsThisMonth: monthBookings.length,
      bookedDaysThisMonth: uniqueDays,
      pendingPayments,
      totalRooms: activeRooms,
    };
  },
});

export const get = query({
  args: { id: v.id("bookings") },
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.id);
    if (!booking) return null;
    const org = await ctx.db.get(booking.orgId);
    const room = await ctx.db.get(booking.roomId);
    return { ...booking, organization: org, room };
  },
});

export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const conflicts = await ctx.db
      .query("bookings")
      .withIndex("by_room_date", (q) =>
        q.eq("roomId", args.roomId).eq("bookingDate", args.bookingDate)
      )
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();

    const hasConflict = conflicts.some(
      (b) => b.startTime < args.endTime && b.endTime > args.startTime
    );

    if (hasConflict) {
      throw new Error("يوجد تعارض في الحجز: القاعة محجوزة في هذا الوقت");
    }

    return await ctx.db.insert("bookings", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("bookings"),
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
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;

    const conflicts = await ctx.db
      .query("bookings")
      .withIndex("by_room_date", (q) =>
        q.eq("roomId", args.roomId).eq("bookingDate", args.bookingDate)
      )
      .filter((q) => q.neq(q.field("_id"), id))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();

    const hasConflict = conflicts.some(
      (b) => b.startTime < args.endTime && b.endTime > args.startTime
    );

    if (hasConflict) {
      throw new Error("يوجد تعارض في الحجز: القاعة محجوزة في هذا الوقت");
    }

    await ctx.db.patch(id, { ...data, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("bookings") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { deletedAt: Date.now(), updatedAt: Date.now() });
  },
});
