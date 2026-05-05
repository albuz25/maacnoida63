import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MAAC NCR creative courses preview";
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
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0a",
          color: "white",
          padding: 72,
          fontFamily: "Arial, sans-serif",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -120,
            top: -120,
            width: 520,
            height: 520,
            borderRadius: 999,
            backgroundColor: "rgba(255,215,0,0.22)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -120,
            top: 48,
            width: 520,
            height: 220,
            border: "18px solid rgba(255,215,0,0.34)",
            borderRadius: 999,
            transform: "rotate(-18deg)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 96,
              height: 96,
              borderRadius: 28,
              background: "#FFD700",
              color: "#0a0a0a",
              fontSize: 54,
              fontWeight: 900,
            }}
          >
            M
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ color: "#FFD700", fontSize: 42, fontWeight: 900, letterSpacing: 6 }}>MAAC NCR</div>
            <div style={{ color: "rgba(255,255,255,0.68)", fontSize: 24 }}>Noida Sector 63</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 880 }}>
          <div style={{ color: "#FFD700", fontSize: 28, fontWeight: 800, letterSpacing: 4 }}>
            ANIMATION • VFX • DESIGN • BVOC
          </div>
          <div style={{ fontSize: 78, fontWeight: 900, lineHeight: 0.95 }}>
            Build a creative career with industry-ready skills.
          </div>
          <div style={{ color: "rgba(255,255,255,0.72)", fontSize: 32, lineHeight: 1.3 }}>
            Courses in Animation, VFX, Graphic Design, Game Design, UI/UX and B.Voc Animation & VFX.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "rgba(255,255,255,0.76)",
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          <span>www.maacncr.com</span>
          <span style={{ color: "#FFD700" }}>Request a Callback</span>
        </div>
      </div>
    ),
    size,
  );
}
