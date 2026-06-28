import { ImageResponse } from "next/og";

export const alt = "Scrub for macOS: uninstall Mac apps and their leftovers.";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

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
          background: "linear-gradient(135deg, #08080a 0%, #151114 58%, #21100d 100%)",
          color: "#f7f7f8",
          fontFamily: "Arial, Helvetica, sans-serif",
          padding: "72px 78px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: 560 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              marginBottom: 44,
              color: "#ffbd62",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            <div
              style={{
                width: 82,
                height: 82,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 22,
                background: "linear-gradient(145deg, #ffcf70 0%, #ff8f36 48%, #d94f1f 100%)",
                color: "#17110b",
                fontSize: 48,
                fontWeight: 900,
                boxShadow: "0 20px 44px rgba(255, 130, 40, 0.28)",
              }}
            >
              S
            </div>
            Scrub for macOS
          </div>
          <div style={{ fontSize: 78, lineHeight: 0.98, fontWeight: 800, letterSpacing: 0 }}>
            Uninstall Mac apps.
          </div>
          <div style={{ color: "#ffb13d", fontSize: 76, lineHeight: 1.02, fontWeight: 800, letterSpacing: 0 }}>
            Clean up leftovers.
          </div>
          <div style={{ marginTop: 30, color: "#c9c9cf", fontSize: 30, lineHeight: 1.35 }}>
            Free, private, signed and notarized for macOS 14 or later.
          </div>
        </div>
        <div
          style={{
            width: 420,
            height: 360,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(255,255,255,0.20)",
            borderRadius: 32,
            background: "rgba(255,255,255,0.07)",
            boxShadow: "0 34px 90px rgba(0,0,0,0.45)",
            overflow: "hidden",
            padding: 24,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              borderRadius: 22,
              background: "#f4f1ed",
              padding: 14,
            }}
          >
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: 99, background: "#ff5f57" }} />
              <div style={{ width: 12, height: 12, borderRadius: 99, background: "#ffbd2e" }} />
              <div style={{ width: 12, height: 12, borderRadius: 99, background: "#28c840" }} />
            </div>
            {[
              ["WhatsApp", "2.38 GB"],
              ["Slack", "1.14 GB"],
              ["Arc", "812 MB"],
            ].map(([name, size]) => (
              <div
                key={name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: 16,
                  background: "#ffffff",
                  color: "#171717",
                  padding: "12px 16px",
                  fontSize: 23,
                  fontWeight: 800,
                }}
              >
                <span>{name}</span>
                <span style={{ color: "#d75d18" }}>{size}</span>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                borderRadius: 16,
                background: "#171717",
                color: "#ffbd62",
                padding: "12px 16px",
                fontSize: 22,
                fontWeight: 900,
              }}
            >
              Move selected leftovers to Trash
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
