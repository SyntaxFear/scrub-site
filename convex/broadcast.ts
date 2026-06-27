import { internalAction, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { updateEmail } from "./emailTemplates";

const SITE = "https://scrubmac.app";

// Everyone who should receive an update broadcast: confirmed newsletter
// subscribers + signed-in users who set updatesOptIn. Deduped, suppressions removed.
export const recipients = internalQuery({
  args: {},
  handler: async (ctx): Promise<{ email: string; token: string }[]> => {
    const subs = await ctx.db.query("subscribers").collect();
    const list: { email: string; token: string }[] = subs
      .filter((s) => s.status === "confirmed")
      .map((s) => ({ email: s.email, token: s.token }));

    for (const p of await ctx.db.query("profiles").collect()) {
      if (!p.updatesOptIn) continue;
      const user = await ctx.db.get(p.userId);
      if (user?.email) list.push({ email: user.email, token: "" });
    }

    const suppressed = new Set(
      (await ctx.db.query("emailSuppressions").collect()).map((s) =>
        s.email.toLowerCase(),
      ),
    );
    const seen = new Set<string>();
    const out: { email: string; token: string }[] = [];
    for (const r of list) {
      const e = r.email.toLowerCase();
      if (suppressed.has(e) || seen.has(e)) continue;
      seen.add(e);
      out.push(r);
    }
    return out;
  },
});

// Send an update broadcast. Run from the Convex dashboard:
//   broadcast:send  { subject: "Scrub 1.1", title: "Scrub 1.1 is out", bodyHtml: "<p>...</p>" }
// (Sandbox sends only reach SES-verified recipients until production access lands.)
export const send = internalAction({
  args: { subject: v.string(), title: v.string(), bodyHtml: v.string() },
  handler: async (ctx, { subject, title, bodyHtml }) => {
    const recips: { email: string; token: string }[] = await ctx.runQuery(
      internal.broadcast.recipients,
      {},
    );
    let sent = 0;
    for (const r of recips) {
      const unsubscribeUrl = r.token
        ? `${SITE}/unsubscribe?token=${r.token}`
        : `${SITE}/`;
      const html = updateEmail({ title, bodyHtml, unsubscribeUrl });
      try {
        await ctx.runAction(internal.email.send, { to: r.email, subject, html });
        sent++;
      } catch (err) {
        console.error("broadcast send failed for", r.email, String(err));
      }
    }
    return { recipients: recips.length, sent };
  },
});
