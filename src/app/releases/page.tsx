import { DownloadLink } from "@/components/DownloadLink";
import {
  downloadPathForRelease,
  formatBytes,
  formatReleaseDate,
  latestRelease,
  visibleReleases,
} from "@/lib/releases";
import { existsSync } from "node:fs";
import Link from "next/link";
import path from "node:path";

export const dynamic = "error";

export const metadata = {
  title: "Scrub Releases",
  description: "Latest and previous Scrub for macOS downloads and release notes.",
  alternates: { canonical: "https://scrubmac.app/releases" },
  openGraph: {
    title: "Scrub Releases",
    description: "Latest and previous Scrub for macOS downloads and release notes.",
    url: "https://scrubmac.app/releases",
    siteName: "Scrub",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Scrub Releases",
    description: "Latest and previous Scrub for macOS downloads and release notes.",
  },
};

function archiveExists(archivePath: string) {
  return existsSync(path.join(process.cwd(), "public", archivePath.replace(/^\//, "")));
}

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
          Primary download buttons always install the latest version. Previous builds are listed here
          when their archived DMG is available.
        </p>

        <section className="release-list" aria-label="Latest five Scrub releases">
          {visibleReleases.map((release, index) => {
            const isLatest = release.version === latestRelease.version;
            const href = downloadPathForRelease(release, index);
            const canDownload = isLatest || archiveExists(release.archivePath);
            return (
              <article className="release-row" key={`${release.version}-${release.build}`}>
                <div className="release-row-head">
                  <div>
                    <h2>Scrub {release.version}</h2>
                    <p>
                      Build {release.build} · {formatReleaseDate(release.date)} · macOS{" "}
                      {release.minimumMacOS}+ · {formatBytes(release.fileSize)}
                    </p>
                  </div>
                  {canDownload ? (
                    <DownloadLink
                      className={isLatest ? "nav-cta" : "secondary-download"}
                      source={isLatest ? "releases-latest" : `releases-${release.version}`}
                      href={href}
                    >
                      {isLatest ? "Download latest" : `Download ${release.version}`}
                    </DownloadLink>
                  ) : (
                    <span className="download-unavailable">Archive pending</span>
                  )}
                </div>
                <ul className="release-notes">
                  {release.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
                <p className="release-sha">SHA-256: {release.sha256}</p>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
