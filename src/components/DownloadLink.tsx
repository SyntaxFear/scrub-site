"use client";

import { ReactNode } from "react";
import posthog from "posthog-js";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

// The DMG download link, instrumented for the key "download" metric:
// fires a PostHog `download_clicked` event and increments the Convex counter.
export function DownloadLink({
  className,
  source,
  children,
}: {
  className?: string;
  source: string;
  children: ReactNode;
}) {
  const record = useMutation(api.downloads.record);
  return (
    <a
      className={className}
      href="/Scrub.dmg"
      download
      onClick={() => {
        posthog.capture("download_clicked", { source });
        void record({ source });
      }}
    >
      {children}
    </a>
  );
}
