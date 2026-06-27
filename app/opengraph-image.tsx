import { ImageResponse } from "next/og";
import { siteConfig } from "@/constants/site";

export const alt = `${siteConfig.name} — Data Analyst Portfolio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(135deg, #030712 0%, #0f172a 45%, #1e1b4b 100%)",
          padding: "72px 80px",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: "#3b82f6",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Data Analyst Portfolio
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 72,
            fontWeight: 700,
            color: "#f8fafc",
            lineHeight: 1.05,
            maxWidth: 900,
          }}
        >
          {siteConfig.name}
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 34,
            color: "#94a3b8",
            maxWidth: 900,
            lineHeight: 1.3,
          }}
        >
          {siteConfig.role}
        </div>
        <div
          style={{
            marginTop: 40,
            display: "flex",
            gap: 16,
            fontSize: 24,
            color: "#06b6d4",
          }}
        >
          <span>SQL Server</span>
          <span>·</span>
          <span>Power BI</span>
          <span>·</span>
          <span>Python</span>
          <span>·</span>
          <span>GenAI</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
