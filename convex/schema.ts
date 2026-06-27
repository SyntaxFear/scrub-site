import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Custom auth for the native macOS app. Sign-in tokens (Apple/Google identity
// tokens, email codes) are verified server-side; the app holds only an opaque
// session token. No web/browser auth — the website is download-only.
export default defineSchema({
  // One row per signed-in person, keyed by provider subject or email.
  appUsers: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    appleSub: v.optional(v.string()),
    googleSub: v.optional(v.string()),
    createdAt: v.number(),
    lastSeenAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_appleSub", ["appleSub"])
    .index("by_googleSub", ["googleSub"]),

  // Opaque session tokens issued to the app and stored in its Keychain.
  appSessions: defineTable({
    token: v.string(),
    userId: v.id("appUsers"),
    createdAt: v.number(),
    expiresAt: v.number(),
  }).index("by_token", ["token"]),

  // Short-lived email sign-in codes (hashed, never stored in plaintext).
  emailCodes: defineTable({
    email: v.string(),
    codeHash: v.string(),
    expiresAt: v.number(),
    attempts: v.number(),
    createdAt: v.number(),
  }).index("by_email", ["email"]),
});
