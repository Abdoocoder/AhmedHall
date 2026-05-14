import { v } from "convex/values";
import { query } from "./_generated/server";

export const getUserRole = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const role = await ctx.db
      .query("userRoles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    return role?.role ?? "user";
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("userRoles").collect();
  },
});
