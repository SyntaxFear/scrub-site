import { DownloadLink } from "@/components/DownloadLink";
import { LandingAnimations } from "@/components/LandingAnimations";
import { formatBytes, formatReleaseDate, latestRelease } from "@/lib/releases";
import Image from "next/image";
import Link from "next/link";

const SITE_URL = "https://scrubmac.app";
const DOWNLOAD_URL = `${SITE_URL}${latestRelease.latestPath}`;
const DMG_SHA256 = latestRelease.sha256;

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Scrub",
  alternateName: "Scrub for macOS",
  applicationCategory: "UtilitiesApplication",
  applicationSubCategory: "macOS app uninstaller",
  operatingSystem: "macOS 14 or later",
  url: SITE_URL,
  downloadUrl: DOWNLOAD_URL,
  installUrl: DOWNLOAD_URL,
  image: `${SITE_URL}/assets/icon-512.png`,
  screenshot: [
    `${SITE_URL}/assets/screenshots/scrub-app-detail.png`,
    `${SITE_URL}/assets/screenshots/scrub-leftovers.png`,
    `${SITE_URL}/assets/screenshots/scrub-app-slack.png`,
  ],
  softwareVersion: latestRelease.version,
  fileSize: formatBytes(latestRelease.fileSize),
  description:
    "Scrub is a native macOS app uninstaller that removes apps and the related caches, containers, preferences, launch agents, helpers, and leftovers they leave behind.",
  featureList: [
    "Complete app uninstall with related support files",
    "Leftovers scan for already-deleted apps",
    "True disk footprint view",
    "Trash-first reversible cleanup",
    "Local on-device scanning and cleanup",
  ],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: DOWNLOAD_URL,
  },
  publisher: {
    "@type": "Organization",
    name: "Scrub",
    url: SITE_URL,
  },
  isAccessibleForFree: true,
  isFamilyFriendly: true,
  sha256: DMG_SHA256,
};

const faqs = [
  {
    question: "Does Scrub delete files immediately?",
    answer: "No. Selected items move to Trash first, so you can restore them until you empty it.",
  },
  {
    question: "What does Scrub look for?",
    answer:
      "The app bundle plus related caches, preferences, containers, support files, launch agents, and helpers.",
  },
  {
    question: "Does Scrub upload cleanup data?",
    answer:
      "No. Cleanup happens locally on your Mac; deletion details are not uploaded.",
  },
  {
    question: "Why direct download?",
    answer:
      "Scrub needs disk access the Mac App Store sandbox does not allow. The app is Developer ID signed and Apple-notarized.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const features = [
  {
    title: "App + leftovers",
    body: "Find the bundle, support data, caches, preferences, containers, agents, and helpers together.",
    icon: "trash",
  },
  {
    title: "Deleted-app scan",
    body: "Surface orphaned files from apps you already removed, while skipping Apple system paths.",
    icon: "search",
  },
  {
    title: "True footprint",
    body: "See the real size of an app with its related data, not only the .app bundle.",
    icon: "chart",
  },
  {
    title: "Trash first",
    body: "Move selected files to Trash first and keep protected macOS paths out of the cleanup.",
    icon: "shield",
  },
];

const latestReleaseFacts = [
  { label: "Released", value: formatReleaseDate(latestRelease.date) },
  { label: "Build", value: latestRelease.build },
  { label: "Requires", value: `macOS ${latestRelease.minimumMacOS}+` },
  { label: "Size", value: formatBytes(latestRelease.fileSize) },
];

function Icon({ name }: { name: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
  };

  switch (name) {
    case "trash":
      return (
        <svg {...common}>
          <path d="M3 6h18" />
          <path d="M8 6V4h8v2" />
          <path d="M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common}>
          <path d="M3 3v18h18" />
          <rect x="7" y="11" width="3" height="7" />
          <rect x="12" y="7" width="3" height="11" />
          <rect x="17" y="13" width="3" height="5" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "eye":
      return (
        <svg {...common}>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="M12 5l7 7-7 7" />
        </svg>
      );
    case "lock":
      return (
        <svg {...common}>
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
      );
    case "info":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
        </svg>
      );
    case "download":
      return (
        <svg {...common}>
          <path d="M12 3v12" />
          <path d="m8 11 4 4 4-4" />
          <path d="M5 21h14" />
        </svg>
      );
    case "check":
    default:
      return (
        <svg {...common}>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      );
  }
}

function LatestReleaseCard() {
  return (
    <article className="release-card reveal-card">
      <div className="release-summary">
        <div className="release-title-row">
          <Image className="release-icon" src="/assets/icon-180.png" alt="" width={62} height={62} />
          <div>
            <p className="eyebrow">Latest Version</p>
            <h2 id="latest-release-title">Scrub {latestRelease.version}</h2>
          </div>
        </div>
        <p className="release-meta">
          Apple-notarized direct download, ready for macOS {latestRelease.minimumMacOS} or later.
        </p>
        <dl className="release-facts" aria-label={`Scrub ${latestRelease.version} release details`}>
          {latestReleaseFacts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="release-notes-panel">
        <p className="release-notes-label">What&apos;s New</p>
        <ul className="release-highlights" aria-label={`Scrub ${latestRelease.version} highlights`}>
          {latestRelease.highlights.slice(0, 3).map((highlight) => (
            <li key={highlight}>
              <Icon name="check" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="release-actions">
        <div className="release-file">
          <span>Scrub.dmg</span>
          <small>{formatBytes(latestRelease.fileSize)} installer</small>
        </div>
        <DownloadLink className="download release-download" source="latest-card">
          <Icon name="download" />
          Download latest
        </DownloadLink>
        <Link className="text-link" href="/releases">
          View previous versions
        </Link>
      </div>
    </article>
  );
}

export const dynamic = "error";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <LandingAnimations />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="page-shell">
        <div className="glow glow-a" />
        <div className="glow glow-b" />

        <nav aria-label="Primary navigation">
          <div className="wrap nav-wrap">
            <a className="brand" href="#main" aria-label="Scrub home">
              <Image src="/assets/favicon-64.png" alt="" width={28} height={28} />
              <span>Scrub</span>
            </a>
            <div className="nav-actions">
              <a href="#faq">FAQ</a>
              <Link href="/releases">Releases</Link>
              <DownloadLink className="nav-cta" source="nav">
                Download
              </DownloadLink>
            </div>
          </div>
        </nav>

        <main id="main" tabIndex={-1}>
          <header className="hero" aria-labelledby="hero-title">
            <div className="wrap hero-wrap">
              <Image className="hero-mark reveal-hero" src="/assets/icon-256.png" alt="" width={92} height={92} priority />
              <div className="hero-kicker reveal-hero">Scrub for macOS</div>
              <h1 id="hero-title" className="reveal-hero">
                <span className="hero-line">Uninstall apps.</span>
                <span className="hero-line hero-line-accent">Leave no leftovers.</span>
              </h1>
              <p className="subtitle reveal-hero">
                A clean, native way to find hidden app files and move them to Trash.
              </p>

              <div className="hero-actions reveal-hero">
                <DownloadLink className="download" source="hero">
                  <Icon name="download" />
                  Download
                </DownloadLink>
              </div>
              <p className="meta reveal-hero">
                Free · v{latestRelease.version} · macOS {latestRelease.minimumMacOS}+ · Apple-notarized
              </p>

              <figure className="hero-window reveal-hero" aria-label="Scrub app screenshot">
                <Image
                  src="/assets/screenshots/scrub-app-detail.webp"
                  alt="Screenshot of Scrub showing WhatsApp selected with related app files, containers, scripts, and sizes"
                  width={1000}
                  height={640}
                  sizes="(max-width: 700px) calc(100vw - 28px), 1040px"
                  priority
                  unoptimized
                />
              </figure>
            </div>
          </header>

          <section className="release-card-section reveal-section" aria-labelledby="latest-release-title">
            <div className="wrap">
              <LatestReleaseCard />
            </div>
          </section>

          <section className="showcase reveal-section" aria-labelledby="showcase-title">
            <div className="wrap product-wrap">
              <div className="showcase-head product-head">
                <p className="eyebrow">Two views</p>
                <h2 id="showcase-title">Apps and leftovers, separated.</h2>
              </div>
              <div className="product-stage" aria-label="Scrub product views">
                <figure className="product-window product-window-main reveal-card">
                  <Image
                    src="/assets/screenshots/scrub-app-slack.webp"
                    alt="Screenshot of Scrub showing Slack selected with containers, group containers, app scripts, and total disk usage"
                    width={1000}
                    height={640}
                    sizes="(max-width: 700px) calc(100vw - 28px), 760px"
                    unoptimized
                  />
                  <figcaption>Applications</figcaption>
                </figure>
                <figure className="product-window product-window-float reveal-card">
                  <Image
                    src="/assets/screenshots/scrub-leftovers.webp"
                    alt="Screenshot of Scrub's Leftovers tab showing orphaned Microsoft Word files selected for removal"
                    width={1000}
                    height={640}
                    sizes="(max-width: 700px) calc(100vw - 28px), 540px"
                    unoptimized
                  />
                  <figcaption>Leftovers</figcaption>
                </figure>
              </div>
            </div>
          </section>

          <section className="section feature-section reveal-section" aria-labelledby="features-title">
            <div className="wrap">
              <div className="section-head">
                <p className="eyebrow">Cleaner Uninstalls</p>
                <h2 id="features-title">Cleaner than dragging apps to Trash.</h2>
                <p>
                  Scrub groups related files so cleanup stays fast, visible, and reversible.
                </p>
              </div>

              <div className="features">
                {features.map((feature) => (
                  <article className="feature reveal-card" key={feature.title}>
                    <div className="ico">
                      <Icon name={feature.icon} />
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="strip section reveal-section" aria-labelledby="privacy-title">
            <div className="wrap">
              <div className="section-head compact">
                <p className="eyebrow">Private By Design</p>
                <h2 id="privacy-title">Local cleanup. Direct download.</h2>
              </div>
              <div className="grid2">
                <article className="note-card reveal-card">
                  <div className="ico">
                    <Icon name="lock" />
                  </div>
                  <h3>Local cleanup</h3>
                  <p>
                    Scrub scans and removes files on-device. The files you choose to delete are not uploaded.
                  </p>
                </article>
                <article className="note-card reveal-card">
                  <div className="ico">
                    <Icon name="info" />
                  </div>
                  <h3>Why direct download</h3>
                  <p>
                    Scrub needs disk access the Mac App Store sandbox does not allow. It ships signed and Apple-notarized.
                  </p>
                </article>
              </div>
            </div>
          </section>

          <section className="section faq reveal-section" id="faq" aria-labelledby="faq-title">
            <div className="wrap">
              <div className="section-head">
                <p className="eyebrow">Questions</p>
                <h2 id="faq-title">Clear answers.</h2>
              </div>
              <div className="faq-grid">
                {faqs.map((faq) => (
                  <article className="faq-item reveal-card" key={faq.question}>
                    <h3>{faq.question}</h3>
                    <p>{faq.answer}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="final reveal-section" aria-labelledby="final-title">
            <div className="wrap final-wrap">
              <Image src="/assets/icon-180.png" alt="" width={90} height={90} />
              <h2 id="final-title">Uninstall apps the clean way.</h2>
              <p>Free, private, and Apple-notarized for macOS 14 or later.</p>
              <div className="cta-row">
                <DownloadLink className="download" source="final">
                  <Icon name="download" />
                  Download Scrub for macOS
                </DownloadLink>
                <div className="gk-note">
                  First launch: if macOS asks, right-click Scrub and choose <strong>Open</strong>.
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer>
          <div className="wrap footer-wrap">
            <div className="foot-brand">
              <Image src="/assets/favicon-64.png" alt="" width={22} height={22} />
              <span>Scrub for macOS</span>
            </div>
            <div className="footer-links" aria-label="Footer links">
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
              <a href="/llms.txt">LLMs</a>
              <a href="mailto:hello@scrubmac.app">Contact</a>
            </div>
            <div className="copy">Made for Mac. Not affiliated with Apple.</div>
          </div>
        </footer>
      </div>
    </>
  );
}
