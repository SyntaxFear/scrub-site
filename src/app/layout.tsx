import type { Metadata, Viewport } from "next";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { PostHogProvider } from "./PostHogProvider";
import "./globals.css";

const SITE_URL = "https://scrubmac.app";

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Scrub — Uninstall Mac apps completely",
  description:
    "Scrub is a native macOS app uninstaller that removes an app and all its leftovers — caches, containers, preferences, launch agents and more. Free, private, and notarized by Apple.",
  icons: {
    icon: "/assets/favicon-64.png",
    apple: "/assets/icon-180.png",
  },
  openGraph: {
    type: "website",
    title: "Scrub — Uninstall Mac apps completely",
    description:
      "Remove a Mac app and every file it left behind. Find leftovers from apps you already deleted. Free, private, notarized.",
    images: ["/assets/icon-512.png"],
    url: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider>
          <PostHogProvider>{children}</PostHogProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
