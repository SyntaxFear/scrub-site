import type { MetadataRoute } from "next";

const SITE_URL = "https://scrubmac.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-06-28");

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/llms.txt`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/llms-full.txt`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];
}
