# Scrub — landing page

Marketing/download site for **Scrub**, a native macOS app uninstaller that removes
an app and all of its leftovers (caches, containers, preferences, launch agents,
system helpers), finds orphaned leftovers from already-deleted apps, and shows each
app's true disk footprint.

**Next.js 16** (App Router) on Vercel. The site is download-only — sign-in happens
in the macOS app, not here. It also hosts the Convex backend that powers the app's
native auth, and the Sparkle `appcast.xml` + DMG for auto-updates.

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

## Verify
- `npm run verify` — lint, node tests, production build, and browser contracts.
- `npm run test:browser` — requires a production build and Google Chrome (or `CHROME_PATH`).

## Updating the download
`scripts/release.sh` in the app repo builds + notarizes the DMG, writes the
versioned archive into `public/releases/`, copies the same build to
`public/Scrub.dmg`, copies the shared release manifest to `src/data/releases.json`,
and updates `appcast.xml`. Redeploy to publish. Keep `Scrub.dmg` as the forced
latest download path.
