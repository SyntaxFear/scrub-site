"use client";

import type posthog from "posthog-js";

type PostHogClient = typeof posthog;

let posthogPromise: Promise<PostHogClient | null> | null = null;

const posthogConfig = {
  // First-party reverse proxy (see next.config.ts rewrites) so ad blockers are
  // less likely to drop analytics. ui_host keeps dashboard links pointing to PostHog.
  api_host: "/ingest",
  ui_host: "https://us.posthog.com",
  capture_pageview: true,
  capture_pageleave: true,
  autocapture: false,
  disable_session_recording: true,
  person_profiles: "identified_only" as const,
};

export function ensurePostHog() {
  if (typeof window === "undefined") return Promise.resolve(null);

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return Promise.resolve(null);

  if (!posthogPromise) {
    posthogPromise = import("posthog-js")
      .then(({ default: posthog }) => {
        if (!posthog.__loaded) {
          posthog.init(key, posthogConfig);
        }

        return posthog;
      })
      .catch((error) => {
        posthogPromise = null;

        if (process.env.NODE_ENV !== "production") {
          console.warn("PostHog failed to load", error);
        }

        return null;
      });
  }

  return posthogPromise;
}

export function warmPostHog() {
  void ensurePostHog();
}

export async function captureDownloadClicked(source: string) {
  const posthog = await ensurePostHog();

  try {
    posthog?.capture("download_clicked", { source });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("PostHog download capture failed", error);
    }
  }
}
