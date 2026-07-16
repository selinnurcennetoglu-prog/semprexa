"use client";

import { useState } from "react";

export default function SocialCircle() {
  const [expanded, setExpanded] = useState(false);

  const socials = [
    {
      name: "TikTok",
      url: "https://www.tiktok.com/@semprexaa",
      icon: "♪",
      color: "#c0392b",
      bg: "#c0392b20",
      label: "TIKTOK",
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/semprexa",
      icon: "✿",
      color: "#d4af37",
      bg: "#d4af3720",
      label: "INSTAGRAM",
    },
    {
      name: "E-posta",
      url: "mailto:semprexaa@gmail.com",
      icon: "✉",
      color: "#8b0000",
      bg: "#8b000020",
      label: "E-POSTA",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <style>{`
        @keyframes royalPulse {
          0%, 100% { box-shadow: 0 0 20px #c0392b30, 0 0 40px #d4af3715; }
          50% { box-shadow: 0 0 30px #c0392b50, 0 0 60px #d4af3725; }
        }
        @keyframes royalPop {
          0% { transform: scale(0) rotate(-180deg); opacity: 0; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes crownSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Expanded items */}
      {expanded && (
        <div className="absolute bottom-20 right-0 space-y-3" style={{ minWidth: "220px" }}>
          {socials.map((s, i) => (
            <a
              key={s.name}
              href={s.url}
              target={s.url.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-sm transition-all hover:translate-x-[-4px]"
              style={{
                background: "linear-gradient(135deg, #12103aee, #0d0a2eee)",
                border: `1px solid ${s.color}40`,
                backdropFilter: "blur(12px)",
                animation: `royalPop 0.3s ease-out ${i * 0.1}s both`,
                boxShadow: `0 4px 20px ${s.color}15`,
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${s.color}, ${s.color}cc)`,
                  boxShadow: `0 2px 8px ${s.color}40`,
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>{s.icon}</span>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "8px", color: s.color, letterSpacing: "0.15em" }}>
                  {s.label}
                </p>
                <p style={{ fontFamily: "var(--font-fuzzy)", color: "#E9CFE8", fontSize: "0.85rem" }}>
                  {s.url.startsWith("mailto:") ? s.url.replace("mailto:", "") : "@" + s.url.split("@").pop()}
                </p>
              </div>
              <div className="ml-auto">
                <span style={{ color: "#d4af3760", fontSize: "0.75rem" }}>→</span>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Main circle button - Royal style */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-110 relative overflow-hidden"
        style={{
          background: expanded
            ? "linear-gradient(135deg, #8b0000, #c0392b)"
            : "linear-gradient(135deg, #12103a, #1a1040)",
          border: "2px solid #d4af3760",
          animation: !expanded ? "royalPulse 3s ease-in-out infinite" : "none",
          cursor: "pointer",
          boxShadow: "0 4px 20px #c0392b30",
        }}
      >
        {/* Rotating gold ring */}
        <div
          className="absolute inset-[-3px] rounded-full"
          style={{
            border: "1px dashed #d4af3740",
            animation: "crownSpin 20s linear infinite",
          }}
        />

        {expanded ? (
          <span style={{ color: "#d4af37", fontSize: "1.5rem", fontWeight: "bold" }}>×</span>
        ) : (
          <div className="text-center">
            <svg width="22" height="18" viewBox="0 0 28 24" fill="none" className="mx-auto mb-0.5">
              <path d="M2 20L5 8L10 14L14 4L18 14L23 8L26 20H2Z" fill="#d4af37" opacity="0.8"/>
              <rect x="2" y="20" width="24" height="3" rx="1" fill="#d4af37" opacity="0.7"/>
            </svg>
            <span
              style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "5px",
                color: "#d4af37",
                letterSpacing: "0.1em",
                display: "block",
              }}
            >
              ELÇİLER
            </span>
          </div>
        )}
      </button>
    </div>
  );
}
