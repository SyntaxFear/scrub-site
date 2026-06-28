import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Terms for downloading and using Scrub, a free direct-download macOS app uninstaller.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms | Scrub",
    description:
      "Terms for downloading and using Scrub, a free direct-download macOS app uninstaller.",
    url: "/terms",
    siteName: "Scrub",
    images: ["/opengraph-image"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms | Scrub",
    description:
      "Terms for downloading and using Scrub, a free direct-download macOS app uninstaller.",
    images: ["/twitter-image"],
  },
};

export const dynamic = "error";

export default function TermsPage() {
  return (
    <main className="legal">
      <div className="wrap legal-wrap">
        <Link className="legal-back" href="/">
          Scrub
        </Link>
        <h1>Terms</h1>
        <p className="legal-lede">
          Scrub is provided as a free macOS utility for removing apps and related files. Use it carefully and review selected items before cleanup.
        </p>

        <section>
          <h2>Use of Scrub</h2>
          <p>
            Scrub is designed to help uninstall Mac apps and move selected related files to the Trash. You are responsible for reviewing selections before removal and for restoring anything you still need before emptying the Trash.
          </p>
        </section>

        <section>
          <h2>No warranty</h2>
          <p>
            Scrub is provided as-is, without warranties of any kind. The app includes safety checks for system-critical paths, but no cleanup utility can guarantee that every possible app-specific file is safe to remove in every environment.
          </p>
        </section>

        <section>
          <h2>Distribution</h2>
          <p>
            Scrub is distributed directly as a Developer ID signed and Apple-notarized Mac app. Scrub is not affiliated with Apple.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            Questions about these terms can be sent to <a href="mailto:hello@scrubmac.app">hello@scrubmac.app</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
