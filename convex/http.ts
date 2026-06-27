import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { authCodeEmail } from "./emailTemplates";

// Native macOS app's bundle identifier — the audience of an Apple identity token.
const APPLE_BUNDLE_ID = "com.levani.Scrub";
const APPLE_JWKS = createRemoteJWKSet(new URL("https://appleid.apple.com/auth/keys"));
const GOOGLE_JWKS = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function sha256hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function genCode(): string {
  const n = crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000;
  return n.toString().padStart(6, "0");
}

async function readJson(req: Request): Promise<Record<string, unknown>> {
  try {
    const body = await req.json();
    return typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

const http = httpRouter();

// Sign in with Apple — verify the identity token, upsert user, issue session.
http.route({
  path: "/native/auth/apple",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const { identityToken, name } = await readJson(req);
    if (typeof identityToken !== "string") return json({ error: "Missing identityToken" }, 400);
    try {
      const { payload } = await jwtVerify(identityToken, APPLE_JWKS, {
        issuer: "https://appleid.apple.com",
        audience: APPLE_BUNDLE_ID,
      });
      const sub = payload.sub as string;
      // Apple only returns the email on the first authorization; fall back to a
      // stable per-user placeholder keyed by the (verified) subject.
      const email = (payload.email as string | undefined) ?? `${sub}@appleid.scrubmac.app`;
      const result = await ctx.runMutation(internal.nativeAuth.signIn, {
        email,
        name: typeof name === "string" ? name : undefined,
        appleSub: sub,
      });
      return json(result);
    } catch {
      return json({ error: "Invalid Apple token" }, 401);
    }
  }),
});

// Sign in with Google — verify the ID token against the native OAuth client id.
http.route({
  path: "/native/auth/google",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const clientId = process.env.GOOGLE_NATIVE_CLIENT_ID;
    if (!clientId) return json({ error: "Google sign-in is not configured yet" }, 503);
    const { idToken } = await readJson(req);
    if (typeof idToken !== "string") return json({ error: "Missing idToken" }, 400);
    try {
      const { payload } = await jwtVerify(idToken, GOOGLE_JWKS, {
        issuer: ["https://accounts.google.com", "accounts.google.com"],
        audience: clientId,
      });
      const email = payload.email as string | undefined;
      if (!email) return json({ error: "No email in Google token" }, 400);
      const result = await ctx.runMutation(internal.nativeAuth.signIn, {
        email,
        name: payload.name as string | undefined,
        image: payload.picture as string | undefined,
        googleSub: payload.sub as string,
      });
      return json(result);
    } catch {
      return json({ error: "Invalid Google token" }, 401);
    }
  }),
});

// Email sign-in, step 1: send a 6-digit code.
http.route({
  path: "/native/auth/email/request",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const { email } = await readJson(req);
    if (typeof email !== "string" || !EMAIL_RE.test(email)) {
      return json({ error: "Enter a valid email address" }, 400);
    }
    const code = genCode();
    await ctx.runMutation(internal.nativeAuth.storeEmailCode, {
      email,
      codeHash: await sha256hex(code),
    });
    const tpl = authCodeEmail(code);
    await ctx.runAction(internal.email.send, {
      to: email.trim().toLowerCase(),
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
    });
    return json({ ok: true });
  }),
});

// Email sign-in, step 2: verify the code, upsert user, issue session.
http.route({
  path: "/native/auth/email/verify",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const { email, code } = await readJson(req);
    if (typeof email !== "string" || typeof code !== "string") {
      return json({ error: "Missing email or code" }, 400);
    }
    const ok = await ctx.runMutation(internal.nativeAuth.verifyEmailCode, {
      email,
      codeHash: await sha256hex(code),
    });
    if (!ok) return json({ error: "Incorrect or expired code" }, 401);
    const result = await ctx.runMutation(internal.nativeAuth.signIn, { email });
    return json(result);
  }),
});

// Validate a stored session token on launch.
http.route({
  path: "/native/auth/session",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const { token } = await readJson(req);
    if (typeof token !== "string") return json({ error: "Missing token" }, 400);
    const user = await ctx.runQuery(internal.nativeAuth.validateSession, { token });
    if (!user) return json({ error: "Invalid session" }, 401);
    return json({ user });
  }),
});

// Sign out — revoke the session.
http.route({
  path: "/native/auth/signout",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const { token } = await readJson(req);
    if (typeof token === "string") {
      await ctx.runMutation(internal.nativeAuth.signOut, { token });
    }
    return json({ ok: true });
  }),
});

export default http;
