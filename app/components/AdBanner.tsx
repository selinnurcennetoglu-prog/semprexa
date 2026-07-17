"use client";

import { useState, useEffect } from "react";
import { useTheme } from "../lib/useTheme";

export default function AdBanner() {
  const { theme } = useTheme();
  const [adImage, setAdImage] = useState<string | null>(null);
  const [adLink, setAdLink] = useState("#");
  const [adText, setAdText] = useState("✦ Özel Kampanya ✦");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    try {
      const img = localStorage.getItem("semprexa_ad_image");
      const link = localStorage.getItem("semprexa_ad_link");
      const text = localStorage.getItem("semprexa_ad_text");
      if (img) setAdImage(img);
      if (link) setAdLink(link);
      if (text) setAdText(text);
    } catch {}
  }, []);

  if (!visible) return null;

  const bgGradient = theme === "karanlik"
    ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
    : theme === "lacivert"
    ? "linear-gradient(135deg, #0a1628 0%, #0f2847 50%, #1a3a6a 100%)"
    : theme === "yesil"
    ? "linear-gradient(135deg, #0a1a12 0%, #1a3a28 50%, #2a5a3a 100%)"
    : theme === "pembe"
    ? "linear-gradient(135deg, #2a1525 0%, #3a2035 50%, #4a2a45 100%)"
    : "linear-gradient(135deg, #2a2218 0%, #3a3028 50%, #4a3a30 100%)";

  return (
    <div className="w-full relative overflow-hidden" style={{ background: bgGradient, borderBottom: "1px solid var(--theme-card-border)" }}>
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 flex items-center justify-between gap-6">
        <div className="flex-1 text-center">
          {adImage ? (
            <a href={adLink} target="_blank" rel="noopener noreferrer">
              <img src={adImage} alt="Reklam" className="max-h-24 md:max-h-32 mx-auto rounded-sm object-contain" />
            </a>
          ) : (
            <a href={adLink} target="_blank" rel="noopener noreferrer" className="block">
              <p style={{ fontFamily: "var(--font-fuzzy)", color: "var(--theme-primary)", fontSize: "1.3rem" }} className="neon-text-pink">
                {adText}
              </p>
              <p style={{ fontFamily: "var(--font-cormorant)", color: "var(--theme-secondary)", fontSize: "0.9rem", marginTop: "4px" }}>
                Fırsatı yakala, hemen tıkla!
              </p>
            </a>
          )}
        </div>
        <button onClick={() => setVisible(false)} className="absolute top-2 right-3 text-xs" style={{ color: "var(--theme-border)" }}>
          ✕
        </button>
      </div>

      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(90deg, transparent 0%, var(--theme-primary)08 50%, transparent 100%)",
      }} />
    </div>
  );
}
