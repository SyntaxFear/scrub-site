import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Privacy details for Scrub: local cleanup, website analytics, native app sign-in, update checks, and contact information.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy | Scrub",
    description:
      "Privacy details for Scrub: local cleanup, website analytics, native app sign-in, update checks, and contact information.",
    url: "/privacy",
    siteName: "Scrub",
    images: ["/opengraph-image"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy | Scrub",
    description:
      "Privacy details for Scrub: local cleanup, website analytics, native app sign-in, update checks, and contact information.",
    images: ["/twitter-image"],
  },
};

export const dynamic = "error";

export default function PrivacyPage() {
  return (
    <main className="legal">
      <div className="wrap legal-wrap">
        <Link className="legal-back" href="/">
          Scrub
        </Link>
        <h1>Privacy</h1>
        <p className="legal-lede">
          Scrub is built around a simple promise: cleanup happens on your Mac. The app does not read or upload the files you choose to remove.
        </p>

        <section>
          <h2>Local cleanup</h2>
          <p>
            Scrub scans your Mac for app bundles, caches, containers, preferences, launch agents, helpers, and leftovers. That scan and cleanup flow runs on-device. Selected items move to the Trash first.
          </p>
        </section>

        <section>
          <h2>Website analytics</h2>
          <p>
            The website may use privacy-conscious PostHog analytics to understand page views and download clicks. Session recording is disabled. These analytics are separate from the files you choose to clean in the Mac app.
          </p>
        </section>

        <section>
          <h2>Sign-in and updates</h2>
          <p>
            The native app can use online services for sign-in, sessions, and update checks. Those services are not used to upload deletion details or the contents of files selected for cleanup.
          </p>
        </section>

        <section>
          <h2>AI assistant</h2>
          <p>
            If you connect ChatGPT/Codex and ask the assistant a question, Scrub can send cleanup metadata such as app names, bundle identifiers, paths, categories, sizes, and match confidence. File contents are never sent, and the assistant cannot delete anything.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            Questions about privacy can be sent to <a href="mailto:hello@scrubmac.app">hello@scrubmac.app</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
