import { DownloadLink } from "@/components/DownloadLink";
import {
  formatBytes,
  formatReleaseDate,
  latestRelease,
} from "@/lib/releases";
import Link from "next/link";

export const dynamic = "error";

export const metadata = {
  title: "Scrub Releases",
  description: "Current Scrub for macOS download and release notes.",
  alternates: { canonical: "https://scrubmac.app/releases" },
  openGraph: {
    title: "Scrub Releases",
    description: "Current Scrub for macOS download and release notes.",
    url: "https://scrubmac.app/releases",
    siteName: "Scrub",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Scrub Releases",
    description: "Current Scrub for macOS download and release notes.",
  },
};

export default function ReleasesPage() {
  return (
    <main className="legal releases-page">
      <div className="wrap releases-wrap">
        <Link className="legal-back" href="/">
          Back to Scrub
        </Link>
        <p className="eyebrow">Downloads</p>
        <h1>Scrub Releases</h1>
        <p className="legal-lede">
          Download the current launch version of Scrub for macOS.
        </p>

        <section className="release-list" aria-label="Current Scrub release">
          <article className="release-row">
            <div className="release-row-head">
              <div>
                <h2>Scrub {latestRelease.version}</h2>
                <p>
                  Build {latestRelease.build} · {formatReleaseDate(latestRelease.date)} · macOS{" "}
                  {latestRelease.minimumMacOS}+ · {formatBytes(latestRelease.fileSize)}
                </p>
              </div>
              <DownloadLink className="nav-cta" source="releases-latest" href={latestRelease.latestPath}>
                Download latest
              </DownloadLink>
            </div>
            <ul className="release-notes">
              {latestRelease.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
            <p className="release-sha">SHA-256: {latestRelease.sha256}</p>
          </article>
        </section>
      </div>
    </main>
  );
}
