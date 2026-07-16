"use client";

import { useState } from "react";

export default function SocialCircle() {
  const [expanded, setExpanded] = useState(false);

  const socials = [
    {
      name: "TikTok",
      url: "https://www.tiktok.com/@semprexaa",
      icon: "♪",
      color: "#FF5CA8",
      bg: "#FF5CA820",
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/semprexa",
      icon: "✿",
      color: "#BC6CFF",
      bg: "#BC6CFF20",
    },
    {
      name: "E-posta",
      url: "mailto:semprexaa@gmail.com",
      icon: "✉",
      color: "#00F0FF",
      bg: "#00F0FF20",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <style>{`
        @keyframes socialPulse {
          0%, 100% { box-shadow: 0 0 20px #FF5CA830, 0 0 40px #BC6CFF15; }
          50% { box-shadow: 0 0 30px #FF5CA850, 0 0 60px #BC6CFF25; }
        }
        @keyframes socialPop {
          0% { transform: scale(0) rotate(-180deg); opacity: 0; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes sparkleRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Expanded items */}
      {expanded && (
        <div className="absolute bottom-20 right-0 space-y-3" style={{ minWidth: "200px" }}>
          {socials.map((s, i) => (
            <a
              key={s.name}
              href={s.url}
              target={s.url.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg transition-all hover:translate-x-[-4px]"
              style={{
                background: "linear-gradient(135deg, #111535ee, #0d1130ee)",
                border: `1px solid ${s.color}40`,
                backdropFilter: "blur(10px)",
                animation: `socialPop 0.3s ease-out ${i * 0.1}s both`,
                boxShadow: `0 4px 20px ${s.color}15`,
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: s.bg }}
              >
                <span style={{ fontSize: "1.1rem" }}>{s.icon}</span>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "8px", color: s.color, letterSpacing: "0.15em" }}>
                  {s.name.toUpperCase()}
                </p>
                <p style={{ fontFamily: "var(--font-fuzzy)", color: "#E9CFE8", fontSize: "0.85rem" }}>
                  {s.url.startsWith("mailto:") ? s.url.replace("mailto:", "") : "@" + s.url.split("@").pop()}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Main circle button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-110 relative overflow-hidden"
        style={{
          background: expanded
            ? "linear-gradient(135deg, #FF5CA8, #BC6CFF)"
            : "linear-gradient(135deg, #111535, #1a1040)",
          border: "2px solid #FF5CA860",
          animation: !expanded ? "socialPulse 3s ease-in-out infinite" : "none",
          cursor: "pointer",
          boxShadow: "0 4px 20px #FF5CA830",
        }}
      >
        {/* Rotating sparkle ring */}
        <div
          className="absolute inset-[-2px] rounded-full"
          style={{
            border: "1px dashed #BC6CFF40",
            animation: "sparkleRotate 15s linear infinite",
          }}
        />

        {expanded ? (
          <span style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "bold" }}>×</span>
        ) : (
          <div className="text-center">
            <span style={{ fontSize: "1.3rem", display: "block", lineHeight: 1 }}>❀</span>
            <span
              style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "6px",
                color: "#FF5CA8",
                letterSpacing: "0.1em",
                display: "block",
                marginTop: "2px",
              }}
            >
              BİZE ULAŞIN
            </span>
          </div>
        )}
      </button>
    </div>
  );
}
