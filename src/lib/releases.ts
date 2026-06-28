import manifest from "@/data/releases.json";

export type ReleaseEntry = {
  version: string;
  build: string;
  date: string;
  minimumMacOS: string;
  highlights: string[];
  sha256: string;
  fileSize: number;
  latestPath: string;
  archivePath: string;
};

type ReleaseManifest = {
  schemaVersion: number;
  releases: ReleaseEntry[];
};

const releaseManifest = manifest as ReleaseManifest;

export const releases = releaseManifest.releases;
export const latestRelease = releases[0];
export const visibleReleases = releases.slice(0, 5);

export function formatReleaseDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00.000Z`));
}

export function formatBytes(bytes: number) {
  const mb = bytes / 1_000_000;
  return `${mb.toFixed(mb >= 10 ? 0 : 1)} MB`;
}

export function downloadPathForRelease(release: ReleaseEntry, index: number) {
  return index === 0 ? release.latestPath : release.archivePath;
}
