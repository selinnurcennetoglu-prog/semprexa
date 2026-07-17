"use client";

import { useState } from "react";

interface ThemeSelectorProps {
  onSelect: (theme: string) => void;
  onSkip?: () => void;
}

const themes = [
  {
    value: "karanlik",
    label: "Karanlık",
    sublabel: "Skull & Chain",
    emoji: "💀",
    bg: "radial-gradient(ellipse at 30% 40%, #c0c0c020 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, #e6394615 0%, transparent 60%), linear-gradient(180deg, #0a0a0a 0%, #141414 100%)",
    colors: ["#0a0a0a", "#c0c0c0", "#808080", "#e63946"],
    cardBg: "#141414",
  },
  {
    value: "lacivert",
    label: "Lacivert",
    sublabel: "Ocean Depths",
    emoji: "🐙",
    bg: "radial-gradient(ellipse at 30% 40%, #00b4d820 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, #48cae415 0%, transparent 60%), linear-gradient(180deg, #0a1628 0%, #0f1f38 100%)",
    colors: ["#0a1628", "#00b4d8", "#48cae4", "#90e0ef"],
    cardBg: "#0f1f38",
  },
  {
    value: "yesil",
    label: "Yeşil",
    sublabel: "Nature",
    emoji: "🌿",
    bg: "radial-gradient(ellipse at 30% 40%, #52b78820 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, #74c69d15 0%, transparent 60%), linear-gradient(180deg, #0a1a12 0%, #122518 100%)",
    colors: ["#0a1a12", "#52b788", "#74c69d", "#95d5b2"],
    cardBg: "#122518",
  },
  {
    value: "pembe",
    label: "Toz Pembe",
    sublabel: "Rose Garden",
    emoji: "🌸",
    bg: "radial-gradient(ellipse at 30% 40%, #ff6b9d20 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, #ffc0cb15 0%, transparent 60%), linear-gradient(180deg, #2a1525 0%, #331a2e 100%)",
    colors: ["#2a1525", "#ff6b9d", "#ffc0cb", "#ff8fab"],
    cardBg: "#331a2e",
  },
  {
    value: "bej",
    label: "Bej",
    sublabel: "Mixed World",
    emoji: "🌍",
    bg: "radial-gradient(ellipse at 30% 40%, #c9a96e20 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, #d4b89615 0%, transparent 60%), linear-gradient(180deg, #2a2218 0%, #352c20 100%)",
    colors: ["#2a2218", "#c9a96e", "#d4b896", "#e8d5a8"],
    cardBg: "#352c20",
  },
];

export default function ThemeSelector({ onSelect, onSkip }: ThemeSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const handleConfirm = () => {
    onSelect(selected || "karanlik");
    setVisible(false);
  };

  const handleSkip = () => {
    onSelect("karanlik");
    setVisible(false);
  };

  return (
    <div
      className="fixed inset-0 z-[998] flex items-center justify-center px-4"
      style={{
        background: "radial-gradient(ellipse at center, #0B0F2Bf0 0%, #060818f8 100%)",
        backdropFilter: "blur(12px)",
        animation: "tsFadeIn 0.6s ease-out",
      }}
    >
      <style>{`
        @keyframes tsFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes tsSlideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="max-w-2xl w-full" style={{ animation: "tsSlideUp 0.8s ease-out" }}>
        <div className="text-center mb-8">
          <h2 style={{ fontFamily: "var(--font-fuzzy)", fontSize: "2rem" }} className="neon-shimmer">
            Temanı Seç
          </h2>
          <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF", marginTop: "8px" }}>
            Göz zevkine uygun tema seç, istersen sonradan değiştir
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {themes.map(t => (
            <button
              key={t.value}
              onClick={() => setSelected(t.value)}
              className="relative rounded-sm overflow-hidden transition-all hover:translate-y-[-2px]"
              style={{
                border: selected === t.value ? `2px solid ${t.colors[1]}80` : "2px solid #BC6CFF20",
                boxShadow: selected === t.value ? `0 0 25px ${t.colors[1]}25, 0 0 50px ${t.colors[2]}15` : "none",
                cursor: "pointer",
              }}
            >
              <div className="h-28 flex items-center justify-center" style={{ background: t.bg }}>
                <div className="text-center">
                  <span style={{ fontSize: "1.8rem" }}>{t.emoji}</span>
                  <p style={{ fontFamily: "var(--font-fuzzy)", color: t.colors[1], fontSize: "0.95rem", marginTop: "4px" }}>{t.label}</p>
                </div>
              </div>
              <div className="p-2.5 text-center" style={{ background: t.cardBg }}>
                <p style={{ fontFamily: "var(--font-cinzel)", color: t.colors[2], fontSize: "8px", letterSpacing: "0.12em" }}>{t.sublabel.toUpperCase()}</p>
                <div className="flex justify-center gap-1 mt-1.5">
                  {t.colors.map((c, i) => (
                    <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c, border: "1px solid #ffffff15" }} />
                  ))}
                </div>
              </div>
              {selected === t.value && (
                <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: t.colors[1], color: "#fff", fontSize: "10px", fontWeight: "bold" }}>✓</div>
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            className="flex-1 py-4 rounded-sm transition-all hover:translate-y-[-1px]"
            style={{
              background: selected ? themes.find(t => t.value === selected)?.colors[1] + "30" : "#111535",
              color: selected ? themes.find(t => t.value === selected)?.colors[2] || "#fff" : "#BC6CFF60",
              fontFamily: "var(--font-cinzel)",
              fontSize: "11px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              border: selected ? `1px solid ${themes.find(t => t.value === selected)?.colors[1]}50` : "1px solid #BC6CFF30",
              boxShadow: selected ? `0 4px 20px ${themes.find(t => t.value === selected)?.colors[1]}25` : "none",
              cursor: "pointer",
              opacity: selected ? 1 : 0.6,
            }}
          >
            {selected ? "✦ Uygula ✦" : "Bir tema seç"}
          </button>
          <button
            onClick={handleSkip}
            className="px-6 py-4 rounded-sm transition-all hover:translate-y-[-1px]"
            style={{
              border: "1px solid #BC6CFF40",
              color: "#BC6CFF",
              fontFamily: "var(--font-cinzel)",
              fontSize: "11px",
              letterSpacing: "0.15em",
              cursor: "pointer",
            }}
          >
            Geç
          </button>
        </div>
      </div>
    </div>
  );
}
