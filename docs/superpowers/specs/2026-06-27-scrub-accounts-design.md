# Scrub — Accounts, Updates & Analytics (Design Spec)

**Date:** 2026-06-27
**Status:** Approved (verbal), implementation starting
**Owner:** Levani (SyntaxFear / parastashvili)

## 1. Goal

Turn the Scrub landing page into a small product surface that lets the project
**build a user base and notify users about updates**, plus **privacy-friendly
analytics**. Sign-up is via **real accounts** (Sign in with Apple, Sign in with
Google, and email magic-link). The app itself stays local-only and private — the
only thing that leaves a user's Mac is the email/identity they choose to give.

## 2. Non-goals (deferred)

- Native sign-in *inside the Mac app* (Phase 2).
- Gamification / "GB reclaimed" stats & leaderboards (Phase 3 — schema leaves room).
- Licensing / paid tiers.

## 3. Privacy stance (load-bearing)

Scrub's promise is **"we never see what you scrub."** That is about the *deletion
data*, which never leaves the Mac. Accounts and update emails are **opt-in** and
fully separate from the app's local operation. The app will also be **open source**
("verify it yourself"). Marketing email requires an explicit `updatesOptIn` — signing
in is **not** consent to be emailed.

## 4. Architecture

| Layer | Choice |
|---|---|
| Frontend | **Next.js (App Router) on Vercel** — ports the existing static design 1:1, adds auth UI |
| Backend / DB | **Convex** (database + functions + **Convex Auth**) |
| Auth providers | **Apple**, **Google**, **email magic-link** (via SES) |
| Email sending | **Amazon SES** (update broadcasts + magic-link emails); bounce/complaint webhooks |
| Analytics | **PostHog** (cloud) — pageviews + `download_clicked` event; EU/US region TBD |
| Hosting / DMG | Same Vercel project serves the notarized `Scrub.dmg` |

OAuth providers (Apple/Google) return **verified** emails, so email validity is
guaranteed for social sign-ins. Magic-link sign-ups are verified by the click.

## 5. Data model (Convex)

- `users` — managed by Convex Auth: `email`, `name`, `image`, `provider`.
- `profiles` — `userId`, `updatesOptIn: bool`, `optInAt`, `createdAt`.
- `downloads` — append-only events (or a counter doc) for the public download number.
- `emailSuppressions` — addresses that bounced/complained (never email again).
- *(Phase 3)* `stats` — reserved for reclaimed-bytes gamification.

RLS/authorization: a user can read/write only their own `profiles` row. Aggregate
counts (downloads, total users) are exposed via read-only public queries that return
numbers only, never PII.

## 6. Email flows (SES)

- **Magic-link sign-in:** Convex Auth generates a token → SES sends the link.
- **Update broadcast:** an admin-only Convex action batches over `profiles` where
  `updatesOptIn = true` and not suppressed, sending via SES within rate limits,
  scheduled via Convex cron/scheduler. Every email has an **unsubscribe** link
  (token → flips `updatesOptIn = false`).
- **Bounces/complaints:** SES → SNS → Convex HTTP action → add to `emailSuppressions`.

## 7. Analytics (PostHog)

- Client-side PostHog for pageviews + a `download_clicked` event on the DMG button.
- No cookie banner needed if configured cookieless / memory persistence; decision at
  build time to stay consistent with the privacy posture (PostHog `persistence`
  setting, disable session recording).
- Server-side capture of the download count also written to Convex `downloads` so the
  public "X downloads" number is owned by us, not only in PostHog.

## 8. External setup checklist (credentials)

Ordered by dependency. **Bold = needs Levani** (login/2FA/purchase); the rest I drive.

1. **Domain** — *purchase (Levani; financial).* Needed for Apple return URL, SES DKIM,
   production site. Recommendation: `scrubmac.app` (~$10/yr).
2. **Convex** — *Levani logs in* (GitHub/Google), then I create the project + deploy keys.
3. **Google Cloud** — *Levani logs in*; I create the OAuth client (client ID/secret,
   redirect URIs). Works without the custom domain (uses Convex/Vercel callback).
4. **PostHog** — *Levani signs up*; I grab the project API key + host.
5. **Apple Developer** — *Levani logs in + 2FA*; I create the **Services ID** +
   **Sign in with Apple key** (team `CNH4KYRW44`). Needs the domain (step 1).
6. **AWS SES** — *Levani logs in*; I verify the domain (DNS), request production
   access (~24h), create an IAM key. Needs the domain (step 1).

Secrets live only in Convex/Vercel **environment variables** — never in the repo.

## 9. Phasing / sequencing

- **Phase 1a (no domain needed):** Next.js scaffold (port design) + Convex + Convex
  Auth with **Google + email magic-link** + PostHog + download counter. Deployable on
  the `*.vercel.app` URL.
- **Phase 1b (after domain + Apple/SES):** add **Sign in with Apple**, switch email to
  the verified domain via SES, custom domain on the site, leave SES sandbox.
- **Phase 2:** native sign-in in the Mac app. **Phase 3:** gamification stats.

## 10. Testing

- Convex functions: unit tests for signup/opt-in/unsubscribe/suppression logic.
- Auth: manual end-to-end per provider (Google, Apple, magic-link) on preview deploys.
- Email: confirm magic-link + a test broadcast to a seeded address; verify unsubscribe
  and bounce suppression.
- Download counter: click → PostHog event + Convex increment.

## 11. Risks / open questions

- **Domain is the long pole** — Apple Sign in + SES both block on it; it's a purchase
  only Levani can make.
- **SES production access** is a ~24h approval gate.
- **Apple Sign in web setup** is fiddly (Services ID, key, return URLs, domain assoc).
- **PostHog region** (US vs EU) — pick at setup; EU is friendlier for non-US users.
- Static→Next.js is a real rebuild of the page, but the design is carried over verbatim.
