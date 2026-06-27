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
- `src/components/DownloadLink.tsx` — the DMG download link (PostHog `download_clicked`).
- `src/app/PostHogProvider.tsx` — website analytics via a first-party `/ingest` proxy.
- `convex/` — the native-auth backend (Apple/Google/email), deployed separately.
- `public/` — `Scrub.dmg` (Developer ID signed, notarized, stapled), `assets/`,
  and (once a signed release is published) `appcast.xml`.
- `vercel.json` — DMG download headers and asset caching.

## Deploy
- Site: `vercel --prod` (Framework Preset: **Next.js**).
- Backend: `npx convex deploy` (prod deployment `healthy-shepherd-34`).

## Updating the download
`scripts/release.sh` in the app repo builds + notarizes the DMG and (once Sparkle
is set up) drops `Scrub.dmg` + `appcast.xml` into `public/`. Redeploy to publish.
Keep the filename `Scrub.dmg` so the download links stay valid.
