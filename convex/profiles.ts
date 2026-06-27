import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Current signed-in user + their update-email opt-in state (null if signed out).
export const me = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const user = await ctx.db.get(userId);
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    return {
      id: userId,
      name: user?.name ?? null,
      email: user?.email ?? null,
      image: user?.image ?? null,
      updatesOptIn: profile?.updatesOptIn ?? false,
    };
  },
});

// Explicit opt-in / opt-out for product-update emails (separate from sign-in).
export const setUpdatesOptIn = mutation({
  args: { optIn: v.boolean() },
  handler: async (ctx, { optIn }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    if (profile) {
      await ctx.db.patch(profile._id, {
        updatesOptIn: optIn,
        optInAt: optIn ? Date.now() : profile.optInAt,
      });
    } else {
      await ctx.db.insert("profiles", {
        userId,
        updatesOptIn: optIn,
        optInAt: optIn ? Date.now() : undefined,
      });
    }
    return { ok: true };
  },
});
