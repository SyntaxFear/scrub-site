import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  // Convex Auth's built-in tables (users, authSessions, authAccounts, ...).
  ...authTables,

  // Per-user marketing/update consent. Signing in is NOT consent to be emailed;
  // `updatesOptIn` is the explicit opt-in for product-update broadcasts.
  profiles: defineTable({
    userId: v.id("users"),
    updatesOptIn: v.boolean(),
    optInAt: v.optional(v.number()),
  }).index("by_user", ["userId"]),

  // Append-only download events -> powers the public "X downloads" number.
  downloads: defineTable({
    at: v.number(),
    source: v.optional(v.string()),
  }),

  // Addresses that bounced or complained — never email these again.
  emailSuppressions: defineTable({
    email: v.string(),
    reason: v.string(),
    at: v.number(),
  }).index("by_email", ["email"]),
});
