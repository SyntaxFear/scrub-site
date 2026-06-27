"use client";

import { ReactNode } from "react";
import posthog from "posthog-js";

// The DMG download link, instrumented for the key "download" metric via a PostHog
// `download_clicked` event.
export function DownloadLink({
  className,
  source,
  children,
}: {
  className?: string;
  source: string;
  children: ReactNode;
}) {
  return (
    <a
      className={className}
      href="/Scrub.dmg"
      download
      onClick={() => {
        posthog.capture("download_clicked", { source });
      }}
    >
      {children}
    </a>
  );
}
