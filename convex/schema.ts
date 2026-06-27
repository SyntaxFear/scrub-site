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

  // Newsletter subscribers (the "notify me about updates" box — no account needed).
  // Double opt-in: created as "pending" with a token; "confirmed" only after the
  // user clicks the email link. Only confirmed addresses ever get broadcasts.
  subscribers: defineTable({
    email: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("unsubscribed"),
    ),
    token: v.string(),
    source: v.optional(v.string()),
    createdAt: v.number(),
    confirmedAt: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_token", ["token"]),

  // Addresses that bounced or complained — never email these again.
  emailSuppressions: defineTable({
    email: v.string(),
    reason: v.string(),
    at: v.number(),
  }).index("by_email", ["email"]),
});
