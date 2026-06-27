/* eslint-disable @next/next/no-img-element */

import { AuthButton } from "@/components/AuthButton";

export default function Home() {
  return (
    <>
      <div className="glow" />

      <nav>
        <div className="wrap">
          <a className="brand" href="#top">
            <img src="/assets/icon-256.png" alt="Scrub icon" /> Scrub
          </a>
          <div className="nav-actions">
            <AuthButton />
            <a className="nav-cta" href="/Scrub.dmg" download>
              Download
            </a>
          </div>
        </div>
      </nav>

      <a id="top" />
      <header className="hero">
        <div className="wrap">
          <img className="hero-icon" src="/assets/icon-512.png" alt="Scrub app icon" />
          <h1>
            Uninstall Mac apps
            <br />
            <span className="grad">completely.</span>
          </h1>
          <p className="subtitle">
            Scrub removes an app and every file it leaves behind — caches, containers,
            preferences, launch agents and more. Leftovers and all.
          </p>

          <div className="cta-row">
            <a className="download" href="/Scrub.dmg" download>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" />
              </svg>
              Download for macOS
            </a>
            <div className="meta">
              <strong>Free</strong> · macOS 14 or later · Apple notarized · 2.4&nbsp;MB
            </div>
            <div className="gk-note">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4z" />
              </svg>
              If macOS ever asks, right-click the app → <strong>Open</strong> the first time.
            </div>
          </div>

          <div className="pills">
            <span className="pill">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>{" "}
              Trash-first &amp; reversible
            </span>
            <span className="pill">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4z" />
              </svg>{" "}
              100% on your Mac
            </span>
            <span className="pill">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>{" "}
              No tracking, no account
            </span>
          </div>
        </div>
      </header>

      <section className="showcase">
        <div className="wrap">
          <img className="shot-main" src="/assets/screenshots/scrub-app-detail.png" alt="Scrub showing WhatsApp and all of its related files with sizes" />
          <div className="shot-row">
            <img src="/assets/screenshots/scrub-leftovers.png" alt="Scrub finding leftovers from apps that are no longer installed" />
            <img src="/assets/screenshots/scrub-app-slack.png" alt="Scrub showing Slack's container, caches and group containers" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Everything it does</div>
            <h2>A real uninstall, not just to the Trash.</h2>
            <p>
              Dragging an app to the Trash leaves gigabytes of caches, containers and
              preferences behind. Scrub finds all of it and cleans up properly.
            </p>
          </div>

          <div className="features">
            <div className="feature">
              <div className="ico">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18M8 6V4h8v2M6 6l1 14a2 2 0 002 2h6a2 2 0 002-2l1-14" />
                </svg>
              </div>
              <h3>Complete uninstall</h3>
              <p>
                Removes the app plus every related file — Application Support, caches,
                preferences, containers, launch agents and system helpers.
              </p>
            </div>
            <div className="feature">
              <div className="ico">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>
              </div>
              <h3>Find old leftovers</h3>
              <p>
                A dedicated Leftovers tab hunts down files left behind by apps you already
                deleted — and skips Apple’s own system files.
              </p>
            </div>
            <div className="feature">
              <div className="ico">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18" />
                  <rect x="7" y="11" width="3" height="7" />
                  <rect x="12" y="7" width="3" height="11" />
                  <rect x="17" y="13" width="3" height="5" />
                </svg>
              </div>
              <h3>True disk footprint</h3>
              <p>
                See exactly how much space each app really uses — the bundle and all of its
                scattered data — sorted biggest first.
              </p>
            </div>
            <div className="feature">
              <div className="ico">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <h3>One click, with a safety net</h3>
              <p>
                Your files go to the Trash, so it’s reversible. A built-in safety guard
                refuses to touch system-critical paths. Ever.
              </p>
            </div>
            <div className="feature">
              <div className="ico">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h3>Reveal or remove anything</h3>
              <p>
                Inspect every item before it goes. Reveal it in Finder, or delete individual
                files — name-matched items stay unchecked until you confirm.
              </p>
            </div>
            <div className="feature">
              <div className="ico">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </div>
              <h3>Quits, then cleans</h3>
              <p>
                If an app is still running, Scrub quits it gracefully first — then surfaces
                and removes its login items, launch agents and daemons.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="strip section">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Private by design</div>
            <h2>Your Mac, and nothing leaves it.</h2>
          </div>
          <div className="grid2">
            <div className="note-card">
              <div className="ico">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="11" width="16" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 018 0v4" />
                </svg>
              </div>
              <h3>Everything stays local</h3>
              <p>
                Scrub scans your disk entirely on-device. There’s no account, no analytics,
                and no network calls — nothing about your Mac is ever sent anywhere.
              </p>
            </div>
            <div className="note-card">
              <div className="ico">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
              </div>
              <h3>Why it’s not on the App Store</h3>
              <p>
                To delete another app’s files and system-level helpers, Scrub needs deep disk
                access that the Mac App Store sandbox doesn’t allow. So it ships directly —
                signed with a Developer ID and notarized by Apple.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="final">
        <div className="wrap">
          <img src="/assets/icon-512.png" alt="Scrub app icon" />
          <h2>Clean up your Mac, properly.</h2>
          <p>Free. Private. Notarized by Apple. macOS 14 or later.</p>
          <div className="cta-row">
            <a className="download" href="/Scrub.dmg" download>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" />
              </svg>
              Download for macOS
            </a>
            <div className="gk-note">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4z" />
              </svg>
              First launch: right-click → <strong>Open</strong> if macOS asks.
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div className="foot-brand">
            <img src="/assets/icon-256.png" alt="Scrub" /> Scrub for macOS
          </div>
          <div className="copy">Made for Mac. Not affiliated with Apple.</div>
        </div>
      </footer>
    </>
  );
}
