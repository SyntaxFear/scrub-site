"use client";

import { ReactNode } from "react";
import { captureDownloadClicked } from "@/lib/posthogClient";

// The DMG download link, instrumented for the key "download" metric via a PostHog
// `download_clicked` event.
export function DownloadLink({
  className,
  source,
  href = "/Scrub.dmg",
  children,
}: {
  className?: string;
  source: string;
  href?: string;
  children: ReactNode;
}) {
  return (
    <a
      className={className}
      href={href}
      download
      onClick={() => {
        void captureDownloadClicked(source);
      }}
    >
      {children}
    </a>
  );
}
