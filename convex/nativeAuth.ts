import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

const SESSION_TTL_MS = 90 * 24 * 60 * 60 * 1000; // 90 days
const CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_CODE_ATTEMPTS = 5;

/// A long, opaque, unguessable session token.
function newToken(): string {
  return (crypto.randomUUID() + crypto.randomUUID()).replace(/-/g, "");
}

/// Only the fields the app is allowed to see.
function publicUser(u: Doc<"appUsers">) {
  return { id: u._id, email: u.email, name: u.name ?? null, image: u.image ?? null };
}

/// Upsert the user (matched by provider subject, then verified email) and issue a
/// fresh session. Called only from the HTTP layer *after* a token/code is verified.
export const signIn = internalMutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    appleSub: v.optional(v.string()),
    googleSub: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    const now = Date.now();

    let user: Doc<"appUsers"> | null = null;
    if (args.appleSub) {
      const sub = args.appleSub;
      user = await ctx.db
        .query("appUsers")
        .withIndex("by_appleSub", (q) => q.eq("appleSub", sub))
        .unique();
    }
    if (!user && args.googleSub) {
      const sub = args.googleSub;
      user = await ctx.db
        .query("appUsers")
        .withIndex("by_googleSub", (q) => q.eq("googleSub", sub))
        .unique();
    }
    if (!user) {
      user = await ctx.db
        .query("appUsers")
        .withIndex("by_email", (q) => q.eq("email", email))
        .unique();
    }

    let userId: Id<"appUsers">;
    if (user) {
      userId = user._id;
      await ctx.db.patch(userId, {
        lastSeenAt: now,
        ...(args.appleSub && !user.appleSub ? { appleSub: args.appleSub } : {}),
        ...(args.googleSub && !user.googleSub ? { googleSub: args.googleSub } : {}),
        ...(args.name && !user.name ? { name: args.name } : {}),
        ...(args.image && !user.image ? { image: args.image } : {}),
      });
    } else {
      userId = await ctx.db.insert("appUsers", {
        email,
        name: args.name,
        image: args.image,
        appleSub: args.appleSub,
        googleSub: args.googleSub,
        createdAt: now,
        lastSeenAt: now,
      });
    }

    const token = newToken();
    await ctx.db.insert("appSessions", {
      token,
      userId,
      createdAt: now,
      expiresAt: now + SESSION_TTL_MS,
    });

    const fresh = (await ctx.db.get(userId))!;
    return { token, user: publicUser(fresh) };
  },
});

/// Resolve a session token to its user, or null if missing/expired.
export const validateSession = internalQuery({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const session = await ctx.db
      .query("appSessions")
      .withIndex("by_token", (q) => q.eq("token", token))
      .unique();
    if (!session || session.expiresAt < Date.now()) return null;
    const user = await ctx.db.get(session.userId);
    return user ? publicUser(user) : null;
  },
});

export const signOut = internalMutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const session = await ctx.db
      .query("appSessions")
      .withIndex("by_token", (q) => q.eq("token", token))
      .unique();
    if (session) await ctx.db.delete(session._id);
    return { ok: true };
  },
});

/// Replace any pending code for this email with a new hashed one.
export const storeEmailCode = internalMutation({
  args: { email: v.string(), codeHash: v.string() },
  handler: async (ctx, { email, codeHash }) => {
    const e = email.trim().toLowerCase();
    const now = Date.now();
    const existing = await ctx.db
      .query("emailCodes")
      .withIndex("by_email", (q) => q.eq("email", e))
      .collect();
    for (const old of existing) await ctx.db.delete(old._id);
    await ctx.db.insert("emailCodes", {
      email: e,
      codeHash,
      expiresAt: now + CODE_TTL_MS,
      attempts: 0,
      createdAt: now,
    });
  },
});

/// Check a submitted code hash, enforcing expiry and an attempt cap. Consumes the
/// code on success or terminal failure.
export const verifyEmailCode = internalMutation({
  args: { email: v.string(), codeHash: v.string() },
  handler: async (ctx, { email, codeHash }) => {
    const e = email.trim().toLowerCase();
    const row = await ctx.db
      .query("emailCodes")
      .withIndex("by_email", (q) => q.eq("email", e))
      .order("desc")
      .first();
    if (!row) return false;
    if (row.expiresAt < Date.now() || row.attempts >= MAX_CODE_ATTEMPTS) {
      await ctx.db.delete(row._id);
      return false;
    }
    if (row.codeHash !== codeHash) {
      await ctx.db.patch(row._id, { attempts: row.attempts + 1 });
      return false;
    }
    await ctx.db.delete(row._id);
    return true;
  },
});
