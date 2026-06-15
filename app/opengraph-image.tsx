import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ScoreIA — Visibilité IA pour ta marque";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%", display: "flex", flexDirection: "column",
        alignItems: "flex-start", justifyContent: "center",
        background: "#07070d", padding: "80px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}>
        {/* Glow */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "50%",
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,58,237,0.3), transparent)",
        }} />
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 48 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: 900, color: "white",
          }}>S</div>
          <span style={{ fontSize: 28, fontWeight: 900, color: "white", letterSpacing: "-0.02em" }}>ScoreIA</span>
        </div>
        {/* Headline */}
        <h1 style={{
          fontSize: 64, fontWeight: 900, color: "white",
          letterSpacing: "-0.03em", lineHeight: 1.1, margin: 0, maxWidth: 780,
        }}>
          Ta marque est-elle citée par les IA ?
        </h1>
        <p style={{ fontSize: 24, color: "rgba(255,255,255,0.45)", margin: "24px 0 0", maxWidth: 600 }}>
          Score de visibilité IA · ChatGPT · Gemini · Claude · Perplexity
        </p>
        {/* Badge */}
        <div style={{
          marginTop: 48, display: "flex", alignItems: "center", gap: 10,
          background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)",
          borderRadius: 100, padding: "10px 20px",
        }}>
          <span style={{ fontSize: 16, color: "#a78bfa", fontWeight: 700 }}>⚡ Score 100% gratuit · Résultats en 2 minutes</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
