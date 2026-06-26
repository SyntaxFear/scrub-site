# Scrub — landing page

Marketing/download site for **Scrub**, a native macOS app uninstaller that removes
an app and all of its leftovers (caches, containers, preferences, launch agents,
system helpers), finds orphaned leftovers from already-deleted apps, and shows each
app's true disk footprint.

Single static page — no build step. Plain `index.html` + `assets/`.

## Contents
- `index.html` — the landing page (inline CSS, no dependencies).
- `assets/` — app icon (various sizes) and product screenshots.
- `Scrub.dmg` — the downloadable app: **signed with Developer ID, notarized by Apple, and stapled**.
- `vercel.json` — sets the DMG download headers and asset caching.

## Deploy (Vercel)
No framework, no build command. Import this repo into Vercel and deploy as a static
site (Framework Preset: **Other**, Build Command: *none*, Output Directory: `.`),
or run `vercel` from this directory.

## Updating the download
Replace `Scrub.dmg` with a freshly notarized build (see the app repo's
`scripts/release.sh`) and redeploy. Keep the filename `Scrub.dmg` so the download
links stay valid.
