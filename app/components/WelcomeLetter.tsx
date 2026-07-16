"use client";

import { useState, useEffect, useCallback } from "react";

interface WelcomeLetterProps {
  onClose: () => void;
}

export default function WelcomeLetter({ onClose }: WelcomeLetterProps) {
  const [phase, setPhase] = useState<"envelope" | "opening" | "letter">("envelope");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("opening"), 1500);
    const t2 = setTimeout(() => setPhase("letter"), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 600);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center px-4"
      style={{
        background: "radial-gradient(ellipse at center, #0B0F2Bf0 0%, #060818f8 100%)",
        backdropFilter: "blur(12px)",
        animation: "rlFadeIn 0.6s ease-out",
      }}
      onClick={handleClose}
    >
      <style>{`
        @keyframes rlFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes rlEnvelopeLift {
          0% { transform: translateY(80px) scale(0.9); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes rlSealBreak {
          0% { transform: scale(1) rotate(0deg); opacity: 1; }
          50% { transform: scale(1.3) rotate(15deg); opacity: 0.8; }
          100% { transform: scale(0) rotate(45deg); opacity: 0; }
        }
        @keyframes rlFlapOpen {
          0% { transform: perspective(600px) rotateX(0deg); }
          100% { transform: perspective(600px) rotateX(-175deg); }
        }
        @keyframes rlLetterRise {
          0% { transform: translateY(100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes rlGoldShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes rlSealPulse {
          0%, 100% { box-shadow: 0 0 20px #c0392b80, 0 0 40px #c0392b40, 0 0 60px #8b000020; }
          50% { box-shadow: 0 0 30px #c0392ba0, 0 0 60px #c0392b60, 0 0 80px #8b000040; }
        }
        @keyframes rlCrownFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes rlTextReveal {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        className="relative w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ═══════ ZARF ═══════ */}
        {phase === "envelope" && (
          <div
            className="relative mx-auto"
            style={{ width: "380px", height: "260px", animation: "rlEnvelopeLift 1s ease-out" }}
          >
            <div
              className="absolute inset-0 rounded-sm"
              style={{
                background: "linear-gradient(165deg, #1e1545 0%, #150d35 40%, #1a1040 100%)",
                border: "2px solid #d4af3780",
                boxShadow: "0 15px 50px #000000a0, 0 0 80px #d4af3715",
              }}
            />
            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 rounded-tl-sm" style={{ borderColor: "#d4af37" }} />
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 rounded-tr-sm" style={{ borderColor: "#d4af37" }} />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 rounded-bl-sm" style={{ borderColor: "#d4af37" }} />
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 rounded-br-sm" style={{ borderColor: "#d4af37" }} />
            <div
              className="absolute top-0 left-0 right-0"
              style={{
                height: "130px",
                clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                background: "linear-gradient(180deg, #1e1545, #150d35)",
                transformOrigin: "top center",
                animation: "rlFlapOpen 1.2s ease-in-out 1s forwards",
              }}
            />
            {/* KIRMIZI MUHUR */}
            <div
              className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ animation: "rlSealBreak 0.6s ease-in-out 2s forwards" }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: "radial-gradient(circle at 35% 35%, #e74c3c 0%, #c0392b 40%, #8b0000 80%, #5a0000 100%)",
                  boxShadow: "0 4px 15px #00000080, inset 0 2px 4px #ffffff20",
                  animation: "rlSealPulse 2s ease-in-out infinite",
                }}
              >
                <div className="absolute inset-1 rounded-full" style={{ border: "2px solid #ffffff15" }} />
                <div className="absolute inset-3 rounded-full" style={{ border: "1px dashed #ffffff10" }} />
                <div style={{ animation: "rlCrownFloat 3s ease-in-out infinite" }}>
                  <svg width="28" height="24" viewBox="0 0 28 24" fill="none">
                    <path d="M2 20L5 8L10 14L14 4L18 14L23 8L26 20H2Z" fill="#d4af37" opacity="0.9"/>
                    <circle cx="5" cy="8" r="1.5" fill="#ffd700"/>
                    <circle cx="14" cy="4" r="2" fill="#ffd700"/>
                    <circle cx="23" cy="8" r="1.5" fill="#ffd700"/>
                    <rect x="2" y="20" width="24" height="3" rx="1" fill="#d4af37" opacity="0.8"/>
                  </svg>
                </div>
              </div>
            </div>
            <div className="absolute bottom-8 left-8 right-8 space-y-2">
              <div className="h-px" style={{ background: "linear-gradient(to right, transparent, #d4af3740, transparent)" }} />
            </div>
          </div>
        )}

        {/* ═══════ MEKTUP ═══════ */}
        {phase === "letter" && (
          <div
            className="relative mx-auto rounded-sm overflow-hidden"
            style={{
              background: "linear-gradient(170deg, #12103a 0%, #0d0a2e 30%, #0a0824 60%, #0d0a2e 100%)",
              border: "2px solid #d4af3760",
              boxShadow: "0 25px 80px #000000b0, 0 0 100px #d4af3715",
              animation: "rlLetterRise 0.8s ease-out",
              maxWidth: "520px",
            }}
          >
            {/* KAPAT BUTONU */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{
                background: "#8b000080",
                border: "1px solid #d4af3750",
                color: "#d4af37",
                fontSize: "1.1rem",
                lineHeight: 1,
                cursor: "pointer",
              }}
            >
              ✕
            </button>
            {/* Ust altin cerceve */}
            <div className="h-[3px] w-full" style={{ background: "linear-gradient(90deg, #8b0000, #c0392b, #d4af37, #ffd700, #d4af37, #c0392b, #8b0000)", backgroundSize: "200% 100%", animation: "rlGoldShimmer 4s linear infinite" }} />

            {/* Altin kose susleri */}
            <div className="absolute top-4 left-4 w-10 h-10 border-t border-l" style={{ borderColor: "#d4af3750" }} />
            <div className="absolute top-4 right-4 w-10 h-10 border-t border-r" style={{ borderColor: "#d4af3750" }} />
            <div className="absolute bottom-4 left-4 w-10 h-10 border-b border-l" style={{ borderColor: "#d4af3750" }} />
            <div className="absolute bottom-4 right-4 w-10 h-10 border-b border-r" style={{ borderColor: "#d4af3750" }} />

            <div className="p-8 md:p-12">
              {/* TAC */}
              <div className="text-center mb-6" style={{ animation: "rlCrownFloat 4s ease-in-out infinite" }}>
                <svg width="48" height="40" viewBox="0 0 48 40" fill="none" className="mx-auto">
                  <path d="M4 34L8 12L16 22L24 6L32 22L40 12L44 34H4Z" fill="#d4af37" opacity="0.7"/>
                  <path d="M4 34L8 12L16 22L24 6L32 22L40 12L44 34" stroke="#ffd700" strokeWidth="1.5" fill="none"/>
                  <circle cx="8" cy="12" r="2.5" fill="#ffd700"/>
                  <circle cx="24" cy="6" r="3" fill="#ffd700"/>
                  <circle cx="40" cy="12" r="2.5" fill="#ffd700"/>
                  <rect x="4" y="34" width="40" height="4" rx="1.5" fill="#d4af37" opacity="0.8"/>
                </svg>
              </div>

              {/* SUS HATTI */}
              <div className="flex items-center justify-center gap-3 mb-5">
                <div className="h-px flex-1 max-w-16" style={{ background: "linear-gradient(to right, transparent, #d4af3760)" }} />
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M10 0L12 8L20 10L12 12L10 20L8 12L0 10L8 8Z" fill="#d4af37" opacity="0.6"/>
                </svg>
                <div className="h-px flex-1 max-w-16" style={{ background: "linear-gradient(to left, transparent, #d4af3760)" }} />
              </div>

              {/* BASLIK */}
              <h1
                className="neon-shimmer mb-2"
                style={{
                  fontFamily: "var(--font-fuzzy)",
                  fontSize: "clamp(2rem, 6vw, 3rem)",
                  lineHeight: 1.1,
                }}
              >
                Hosgeldin!
              </h1>

              {/* ALTIN AYIRICI */}
              <div className="flex items-center justify-center gap-2 mt-4 mb-6">
                <div className="h-px w-12" style={{ background: "#d4af3740" }} />
                <div className="w-2 h-2 rotate-45" style={{ background: "#c0392b" }} />
                <div className="h-px w-12" style={{ background: "#d4af3740" }} />
              </div>

              {/* MEKTUP ICERIGI */}
              <div
                className="space-y-4 mb-8"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  color: "#E9CFE8",
                  fontSize: "1.05rem",
                  lineHeight: 1.9,
                  animation: "rlTextReveal 0.8s ease-out 0.3s both",
                }}
              >
                <p style={{ color: "#BC6CFF" }}>Sevgili Ziyaretcimiz,</p>

                <p>
                  Sitemize hos geldiniz! Semprexa olarak sizlere en guzel urunleri sunmaya calisiyoruz.
                </p>

                <p>
                  Sitemiz henuz <span className="neon-text-cyan" style={{ fontWeight: 600 }}>yeni</span> oldugu icin bazi eksikler olabilir. Bu konuda anlayisinizi rica ediyoruz.
                </p>

                <p>
                  Onerileriniz ve dusunceleriniz bizim icin cok degerli! Asagidaki hesaplarimizdan bize ulasabilirsiniz:
                </p>

                {/* ILETISIM KARTLARI */}
                <div className="space-y-3 pt-2">
                  <a href="https://www.tiktok.com/@semprexaa" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg transition-all hover:translate-x-1"
                    style={{ background: "linear-gradient(135deg, #FF5CA810, #00F0FF08)", border: "1px solid #FF5CA830" }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#FF5CA820" }}>
                      <span style={{ fontSize: "1.2rem" }}>♪</span>
                    </div>
                    <div>
                      <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", color: "#FF5CA8", letterSpacing: "0.15em" }}>TIKTOK</p>
                      <p style={{ fontFamily: "var(--font-fuzzy)", color: "#E9CFE8", fontSize: "0.95rem" }}>@semprexaa</p>
                    </div>
                  </a>

                  <a href="https://www.instagram.com/semprexa" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg transition-all hover:translate-x-1"
                    style={{ background: "linear-gradient(135deg, #BC6CFF10, #FF5CA808)", border: "1px solid #BC6CFF30" }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#BC6CFF20" }}>
                      <span style={{ fontSize: "1.2rem" }}>✿</span>
                    </div>
                    <div>
                      <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", color: "#BC6CFF", letterSpacing: "0.15em" }}>INSTAGRAM</p>
                      <p style={{ fontFamily: "var(--font-fuzzy)", color: "#E9CFE8", fontSize: "0.95rem" }}>@semprexa</p>
                    </div>
                  </a>

                  <a href="mailto:semprexaa@gmail.com"
                    className="flex items-center gap-3 p-3 rounded-lg transition-all hover:translate-x-1"
                    style={{ background: "linear-gradient(135deg, #00F0FF10, #FFB86B08)", border: "1px solid #00F0FF30" }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#00F0FF20" }}>
                      <span style={{ fontSize: "1.2rem" }}>✉</span>
                    </div>
                    <div>
                      <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", color: "#00F0FF", letterSpacing: "0.15em" }}>E-POSTA</p>
                      <p style={{ fontFamily: "var(--font-fuzzy)", color: "#E9CFE8", fontSize: "0.95rem" }}>semprexaa@gmail.com</p>
                    </div>
                  </a>
                </div>

                {/* IMZA */}
                <p style={{ color: "#BC6CFF", textAlign: "center", marginTop: "1.5rem" }}>
                  Sevgilerimle,<br />
                  <span className="neon-text-pink" style={{ fontFamily: "var(--font-fuzzy)", fontSize: "1.1rem" }}>Semprexa Ekibi</span>
                </p>
              </div>

              {/* BUTON */}
              <button
                onClick={handleClose}
                className="w-full py-4 rounded-sm transition-all hover:translate-y-[-1px]"
                style={{
                  background: "linear-gradient(135deg, #8b0000, #c0392b, #8b0000)",
                  color: "#ffd700",
                  fontFamily: "var(--font-cinzel)",
                  fontSize: "11px",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  border: "1px solid #d4af3760",
                  boxShadow: "0 4px 20px #c0392b40",
                  cursor: "pointer",
                }}
              >
                ✦ Alisverise Basla ✦
              </button>
            </div>

            {/* ALT ALTIN CERCEVE */}
            <div className="h-[3px] w-full" style={{ background: "linear-gradient(90deg, #8b0000, #c0392b, #d4af37, #ffd700, #d4af37, #c0392b, #8b0000)", backgroundSize: "200% 100%", animation: "rlGoldShimmer 4s linear infinite" }} />
          </div>
        )}
      </div>
    </div>
  );
}
