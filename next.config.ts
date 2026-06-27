import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Reverse-proxy PostHog through our own domain (/ingest) so analytics is
  // first-party and isn't blocked by ad-blockers / privacy browsers (Brave).
  // PostHog US cloud: api on us.i.posthog.com, static assets on us-assets.
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  // PostHog uses trailing-slash API paths; don't let Next redirect them.
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
