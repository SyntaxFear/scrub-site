import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Record a DMG download click (called from the site). Privacy-friendly:
// stores only a timestamp + a coarse source label, never anything personal.
export const record = mutation({
  args: { source: v.optional(v.string()) },
  handler: async (ctx, { source }) => {
    await ctx.db.insert("downloads", { at: Date.now(), source });
  },
});

// Public total downloads for the "X downloads" number on the site.
// NOTE: counts rows; fine at small scale. Swap to a single counter doc if it grows.
export const count = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("downloads").collect();
    return rows.length;
  },
});
