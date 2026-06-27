import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { confirmEmail } from "./emailTemplates";

const SITE = "https://scrubmac.app";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Public: start a double opt-in. Stores a "pending" subscriber and emails a
// confirmation link. The address is NOT subscribed until they click it.
export const subscribe = mutation({
  args: { email: v.string(), source: v.optional(v.string()) },
  handler: async (ctx, { email, source }) => {
    const e = email.trim().toLowerCase();
    if (!EMAIL_RE.test(e)) {
      throw new Error("Please enter a valid email address.");
    }
    const existing = await ctx.db
      .query("subscribers")
      .withIndex("by_email", (q) => q.eq("email", e))
      .unique();
    if (existing?.status === "confirmed") {
      return { status: "already" as const };
    }
    const token = crypto.randomUUID();
    if (existing) {
      await ctx.db.patch(existing._id, {
        status: "pending",
        token,
        createdAt: Date.now(),
      });
    } else {
      await ctx.db.insert("subscribers", {
        email: e,
        status: "pending",
        token,
        source,
        createdAt: Date.now(),
      });
    }
    const tpl = confirmEmail(`${SITE}/confirm?token=${token}`);
    await ctx.scheduler.runAfter(0, internal.email.send, {
      to: e,
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
    });
    return { status: "pending" as const };
  },
});

// Public: confirm a pending subscription via the emailed token.
export const confirm = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const sub = await ctx.db
      .query("subscribers")
      .withIndex("by_token", (q) => q.eq("token", token))
      .unique();
    if (!sub) return { ok: false as const };
    if (sub.status !== "confirmed") {
      await ctx.db.patch(sub._id, { status: "confirmed", confirmedAt: Date.now() });
    }
    return { ok: true as const, email: sub.email };
  },
});

// Public: unsubscribe via the token in broadcast emails.
export const unsubscribe = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const sub = await ctx.db
      .query("subscribers")
      .withIndex("by_token", (q) => q.eq("token", token))
      .unique();
    if (!sub) return { ok: false as const };
    await ctx.db.patch(sub._id, { status: "unsubscribed" });
    return { ok: true as const };
  },
});
