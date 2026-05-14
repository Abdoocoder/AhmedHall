import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const requests = await ctx.db.query("bookingRequests").collect();
    return await Promise.all(
      requests.map(async (request) => {
        const room = await ctx.db.get(request.roomId);
        return { ...request, room };
      })
    );
  },
});

export const listPending = query({
  args: {},
  handler: async (ctx) => {
    const requests = await ctx.db
      .query("bookingRequests")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
    return await Promise.all(
      requests.map(async (request) => {
        const room = await ctx.db.get(request.roomId);
        return { ...request, room };
      })
    );
  },
});

export const submit = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("bookingRequests", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const approve = mutation({
  args: { id: v.id("bookingRequests") },
  handler: async (ctx, args) => {
    const request = await ctx.db.get(args.id);
    if (!request) throw new Error("لم يتم العثور على الطلب");

    const existingOrgs = await ctx.db.query("organizations").collect();
    let org = existingOrgs.find((o) => o.name === request.organizationName);

    let orgId: any;
    if (!org) {
      orgId = await ctx.db.insert("organizations", {
        name: request.organizationName,
        contactPerson: request.citizenName,
        phone: request.citizenPhone,
        email: request.citizenEmail || undefined,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    } else {
      orgId = org._id;
    }

    const currentBookings = await ctx.db
      .query("bookings")
      .withIndex("by_room_date", (q) =>
        q.eq("roomId", request.roomId).eq("bookingDate", request.bookingDate)
      )
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();

    const hasConflict = currentBookings.some(
      (b) => b.startTime < request.endTime && b.endTime > request.startTime
    );

    if (hasConflict) {
      throw new Error("يوجد تعارض في الحجز: القاعة محجوزة في هذا الوقت");
    }

    await ctx.db.insert("bookings", {
      orgId,
      roomId: request.roomId,
      bookingDate: request.bookingDate,
      startTime: request.startTime,
      endTime: request.endTime,
      eventName: request.eventName,
      coordinatorName: request.citizenName,
      coordinatorPhone: request.citizenPhone,
      attendeesCount: request.attendeesCount,
      paymentStatus: "pending",
      notes: request.notes,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    await ctx.db.patch(args.id, {
      status: "approved",
      reviewedAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const reject = mutation({
  args: { id: v.id("bookingRequests"), reason: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "rejected",
      rejectionReason: args.reason,
      reviewedAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});
