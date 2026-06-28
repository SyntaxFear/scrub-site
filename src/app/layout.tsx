import type { Metadata, Viewport } from "next";
import { Geist, Plus_Jakarta_Sans } from "next/font/google";
import { PostHogProvider } from "./PostHogProvider";
import "./globals.css";

const SITE_URL = "https://scrubmac.app";
const title = "Scrub — Uninstall Mac apps and clean leftovers";
const description =
  "Scrub is a free, private, Apple-notarized macOS app uninstaller that removes apps plus caches, containers, preferences, launch agents, helpers, and old leftovers.";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Scrub",
  title: {
    default: title,
    template: "%s — Scrub",
  },
  description,
  keywords: [
    "Scrub",
    "Mac app uninstaller",
    "macOS uninstaller",
    "remove app leftovers",
    "Mac cleanup",
    "delete app caches",
    "launch agents",
    "Application Support cleanup",
  ],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/assets/favicon-64.png",
    apple: "/assets/icon-180.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "Scrub",
    title,
    description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Scrub for macOS: uninstall Mac apps and their leftovers.",
      },
    ],
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/twitter-image"],
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${plusJakarta.variable}`}>
      <body>
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
