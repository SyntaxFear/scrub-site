# Scrub — website, downloads, and update feed

Public website for **Scrub**, a native macOS app uninstaller that finds app
leftovers, explains them in plain language, and moves safe removals to the
Trash first.

- Live site: https://scrubmac.app
- App source: https://github.com/SyntaxFear/scrub-app
- License: MIT

This repo contains the marketing site, release download files, Sparkle update
feed, and the Convex backend used by the native app's sign-in flow.

**Next.js 16** (App Router) on Vercel. The site is download-only — sign-in happens
in the macOS app, not here. It also hosts the Convex backend that powers the app's
native auth, and the Sparkle `appcast.xml` + DMG for auto-updates.

## For Non-Technical Visitors

Scrub is the Mac app. This repository is the public website around it:

- The home page explains what Scrub does.
- `/Scrub.dmg` is the latest download.
- `/releases` lists recent versions.
- `public/appcast.xml` is the update feed used by the app.
- `convex/` is backend code for sign-in; secrets are not stored in this repo.

You do not need this repository to install Scrub. Download the app from
https://scrubmac.app instead.

## Contents
- `src/app/` — the landing page (`page.tsx`), layout, and global CSS.
- `src/app/releases/page.tsx` — the last-five release list with previous-version links.
- `src/data/releases.json` — copied from the app repo's shared release manifest.
- `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/manifest.ts` — crawler,
  sitemap, and web manifest metadata routes.
- `src/app/opengraph-image.tsx` / `twitter-image.tsx` — dynamic social cards.
- `src/components/DownloadLink.tsx` — the DMG download link (PostHog `download_clicked`).
- `src/components/LandingAnimations.tsx` — GSAP-powered entrance/reveal motion
  with reduced-motion handling.
- `src/app/PostHogProvider.tsx` — website analytics via a first-party `/ingest` proxy.
- `src/lib/scheduleIdleTask.ts` — shared idle scheduler for non-critical analytics
  and animation imports.
- `convex/` — the native-auth backend (Apple/Google/email), deployed separately.
- `public/` — latest `Scrub.dmg`, archived `releases/Scrub-<version>.dmg` files,
  `assets/`, `llms.txt`, `llms-full.txt`, and `appcast.xml`.
- `vercel.json` — DMG download headers and asset caching.

## Deploy
- Site: `vercel --prod` (Framework Preset: **Next.js**).
- Backend: `npx convex deploy` (prod deployment `healthy-shepherd-34`).

Copy `.env.example` to `.env.local` for local site development. Convex and SES
secrets should be configured in the deployment environment, never committed.

## Verify
- `npm run verify` — lint, node tests, production build, and browser contracts.
- `npm run test:browser` — requires a production build and Google Chrome (or `CHROME_PATH`).

## Updating the download
`scripts/release.sh` in the app repo builds + notarizes the DMG, writes the
versioned archive into `public/releases/`, copies the same build to
`public/Scrub.dmg`, copies the shared release manifest to `src/data/releases.json`,
and updates `appcast.xml`. Redeploy to publish. Keep `Scrub.dmg` as the forced
latest download path.

## Open Source Notes

This repo is open source so users can inspect the download site, release feed,
and native-auth backend. Please read `CONTRIBUTING.md` before proposing changes
and `SECURITY.md` before reporting security-sensitive issues.
