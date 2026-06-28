import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Scrub for macOS",
    short_name: "Scrub",
    description: "A native macOS app uninstaller that removes apps and their leftovers.",
    start_url: "/",
    scope: "/",
    display: "browser",
    background_color: "#08080a",
    theme_color: "#0a0a0b",
    icons: [
      {
        src: "/assets/icon-180.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/assets/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    categories: ["utilities", "productivity"],
  };
}
