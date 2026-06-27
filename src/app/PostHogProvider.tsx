"use client";

import { ReactNode, useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

// Website-only analytics: how visitors interact with the page. The Mac app sends
// NOTHING — this is purely the marketing site. Autocapture covers clicks/interactions,
// capture_pageview on load + pageleave gives views and time-on-page. Session
// recording is off (privacy + cost); person profiles only for identified users.
export function PostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key || posthog.__loaded) return;
    posthog.init(key, {
      // First-party reverse proxy (see next.config.ts rewrites) so ad-blockers
      // don't drop our analytics. ui_host keeps dashboard links pointing to PostHog.
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: true,
      disable_session_recording: true,
      person_profiles: "identified_only",
    });
  }, []);

  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return <>{children}</>;
  return <PHProvider client={posthog}>{children}</PHProvider>;
}
