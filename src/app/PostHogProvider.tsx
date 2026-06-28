"use client";

import { ReactNode, useEffect } from "react";
import { warmPostHog } from "@/lib/posthogClient";
import { scheduleIdleTask } from "@/lib/scheduleIdleTask";

// Website-only analytics. The Mac app sends nothing here; this is purely the
// marketing site. Pageview and pageleave stay enabled, autocapture/session
// recording stay off, and manual events share the same lazy initialization.
export function PostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => {
          for (const registration of registrations) {
            void registration.unregister();
          }
        })
        .catch(() => {});
    }

    return scheduleIdleTask(warmPostHog, { timeout: 3000 });
  }, []);

  return <>{children}</>;
}
