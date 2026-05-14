import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

export const getUserRoleById = internalQuery({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const role = await ctx.db
      .query("userRoles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    return role?.role ?? "user";
  },
});

export const createUserRole = internalMutation({
  args: {
    userId: v.string(),
    role: v.union(v.literal("admin"), v.literal("manager"), v.literal("user")),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userRoles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    if (!existing) {
      await ctx.db.insert("userRoles", args);
    }
  },
});

export const deleteUserRole = internalMutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userRoles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
