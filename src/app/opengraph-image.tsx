import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import path from "node:path";

export const alt = "Scrub for macOS: uninstall Mac apps and their leftovers.";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const assetPath = (...segments: string[]) => path.join(process.cwd(), "public", "assets", ...segments);
const iconSrc = `data:image/png;base64,${readFileSync(assetPath("icon-512.png")).toString("base64")}`;
const screenshotSrc = `data:image/png;base64,${readFileSync(
  assetPath("screenshots", "scrub-app-detail.png"),
).toString("base64")}`;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #070708 0%, #111112 54%, #23130f 100%)",
          color: "#f7f7f8",
          fontFamily: "Arial, Helvetica, sans-serif",
          padding: "64px 72px",
          position: "relative",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -260,
            right: -260,
            width: 620,
            height: 620,
            borderRadius: 520,
            background: "rgba(255, 96, 62, 0.14)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -220,
            left: 170,
            width: 520,
            height: 520,
            borderRadius: 520,
            background: "rgba(255, 177, 61, 0.10)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", width: 520, position: "relative" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginBottom: 34,
              color: "#f8f2e9",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            <img
              src={iconSrc}
              alt=""
              style={{
                width: 76,
                height: 76,
                borderRadius: 18,
                boxShadow: "0 22px 48px rgba(255, 93, 60, 0.34)",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 30, fontWeight: 800 }}>Scrub</span>
              <span style={{ color: "#ffbd62", fontSize: 21, fontWeight: 800 }}>
                App uninstaller for macOS
              </span>
            </div>
          </div>
          <div style={{ fontSize: 70, lineHeight: 0.98, fontWeight: 900, letterSpacing: 0 }}>
            Uninstall apps.
          </div>
          <div style={{ color: "#ffb13d", fontSize: 56, lineHeight: 1.02, fontWeight: 900, letterSpacing: 0 }}>
            Leave no leftovers.
          </div>
          <div style={{ marginTop: 26, color: "#c9c9cf", fontSize: 26, lineHeight: 1.34 }}>
            Find hidden caches, containers, preferences, helpers, and deleted-app leftovers.
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
            {["Free", "Private", "Apple-notarized"].map((label) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.07)",
                  color: "#f7f7f8",
                  padding: "9px 15px",
                  fontSize: 20,
                  fontWeight: 800,
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            width: 514,
            height: 372,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 34,
            background: "linear-gradient(180deg, rgba(255,255,255,0.13), rgba(255,255,255,0.04))",
            boxShadow: "0 40px 100px rgba(0,0,0,0.54)",
            overflow: "hidden",
            padding: 18,
          }}
        >
          <img
            src={screenshotSrc}
            alt=""
            style={{
              width: 478,
              height: 336,
              objectFit: "cover",
              borderRadius: 22,
              boxShadow: "0 26px 64px rgba(0,0,0,0.38)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 36,
              right: 36,
              bottom: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid rgba(255,255,255,0.16)",
              borderRadius: 999,
              background: "rgba(8,8,10,0.78)",
              color: "#f7f7f8",
              padding: "13px 18px",
              fontSize: 19,
              fontWeight: 800,
            }}
          >
            <span>Review before cleanup</span>
            <span style={{ color: "#ffbd62" }}>Trash first</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
