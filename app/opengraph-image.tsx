import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Липко — образователни играчки, които учат чрез игра";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#f7f3ea",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <svg width="62" height="62" viewBox="0 0 24 24">
            <path
              d="M12 2.2 C14.5 5 20 8.5 19.6 14 C19.2 18.8 15 20.6 12.7 21.6 C12.45 21.1 12.2 20.4 12 19.8 C11.8 20.4 11.55 21.1 11.3 21.6 C9 20.6 4.8 18.8 4.4 14 C4 8.5 9.5 5 12 2.2 Z"
              fill="#7ba35a"
            />
            <path d="M12 20 L12 5" stroke="#4e7538" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <div style={{ fontSize: 46, fontWeight: 800, color: "#3b382f" }}>Липко</div>
        </div>
        <div style={{ fontSize: 76, fontWeight: 800, color: "#3b382f", lineHeight: 1.05, maxWidth: 900 }}>
          Игра, която учи.
        </div>
        <div style={{ fontSize: 34, color: "#6f6a5c", marginTop: 28, maxWidth: 820 }}>
          Образователни, Монтесори и дървени играчки — доставени до вратата ви.
        </div>
      </div>
    ),
    { ...size }
  );
}
