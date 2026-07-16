"use client";

import { useState, useEffect } from "react";

interface WelcomeLetterProps {
  onClose: () => void;
}

export default function WelcomeLetter({ onClose }: WelcomeLetterProps) {
  const [phase, setPhase] = useState<"envelope" | "opening" | "letter">("envelope");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("opening"), 1200);
    const t2 = setTimeout(() => setPhase("letter"), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 500);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center px-4"
      style={{
        background: "radial-gradient(ellipse at center, #0B0F2Bee 0%, #0B0F2Bf8 100%)",
        backdropFilter: "blur(8px)",
        animation: "fadeIn 0.5s ease-out",
      }}
      onClick={handleClose}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes envelopeOpen {
          0% { transform: perspective(800px) rotateX(0deg); }
          100% { transform: perspective(800px) rotateX(-180deg); }
        }
        @keyframes letterSlideUp {
          0% { transform: translateY(60px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes sealGlow {
          0%, 100% { box-shadow: 0 0 15px #FF5CA860, 0 0 30px #BC6CFF30; }
          50% { box-shadow: 0 0 25px #FF5CA890, 0 0 50px #BC6CFF50; }
        }
        @keyframes shimmerLine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes floatIn {
          0% { transform: translateY(20px) scale(0.95); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>

      <div
        className="relative w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ENVELOPE */}
        {phase === "envelope" && (
          <div className="relative mx-auto" style={{ width: "320px", height: "220px" }}>
            {/* Envelope body */}
            <div
              className="absolute inset-0 rounded-lg"
              style={{
                background: "linear-gradient(145deg, #1a1040, #2d1570)",
                border: "2px solid #BC6CFF40",
                boxShadow: "0 10px 40px #00000080, 0 0 60px #BC6CFF15, inset 0 0 30px #FF5CA808",
              }}
            />
            {/* Envelope flap (top triangle) */}
            <div
              className="absolute top-0 left-0 right-0"
              style={{
                height: "110px",
                clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                background: "linear-gradient(180deg, #2d1570, #1a1040)",
                border: "2px solid #BC6CFF40",
                transformOrigin: "top center",
                animation: "envelopeOpen 1s ease-in-out 0.8s forwards",
              }}
            />
            {/* Wax seal */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center z-10"
              style={{
                background: "radial-gradient(circle, #FF5CA8, #BC6CFF)",
                animation: "sealGlow 2s ease-in-out infinite",
              }}
            >
              <span style={{ fontFamily: "var(--font-fuzzy)", color: "#fff", fontSize: "1.2rem" }}>S</span>
            </div>
            {/* Decorative lines on envelope */}
            <div className="absolute bottom-6 left-6 right-6 space-y-2">
              <div className="h-px" style={{ background: "linear-gradient(to right, transparent, #BC6CFF30, transparent)" }} />
              <div className="h-px w-3/4 mx-auto" style={{ background: "linear-gradient(to right, transparent, #FF5CA825, transparent)" }} />
            </div>
          </div>
        )}

        {/* LETTER */}
        {phase === "letter" && (
          <div
            className="relative mx-auto rounded-lg overflow-hidden"
            style={{
              background: "linear-gradient(145deg, #111535, #0d1130)",
              border: "2px solid #BC6CFF40",
              boxShadow: "0 20px 60px #00000090, 0 0 80px #BC6CFF20, 0 0 120px #FF5CA810",
              animation: "letterSlideUp 0.8s ease-out",
              maxWidth: "480px",
            }}
          >
            {/* Gold shimmer top border */}
            <div
              className="h-1 w-full"
              style={{
                background: "linear-gradient(90deg, #FF5CA8, #BC6CFF, #00F0FF, #FFB86B, #FF5CA8)",
                backgroundSize: "200% 100%",
                animation: "shimmerLine 3s linear infinite",
              }}
            />

            {/* Letter content */}
            <div className="p-8 md:p-10">
              {/* Header ornament */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, #BC6CFF40)" }} />
                  <span style={{ fontFamily: "var(--font-cinzel)", color: "#FFB86B", fontSize: "10px", letterSpacing: "0.3em" }}>✦ MEKTUP ✦</span>
                  <div className="h-px flex-1" style={{ background: "linear-gradient(to left, transparent, #BC6CFF40)" }} />
                </div>

                <h1
                  className="neon-shimmer mb-2"
                  style={{
                    fontFamily: "var(--font-fuzzy)",
                    fontSize: "clamp(2rem, 6vw, 3rem)",
                    lineHeight: 1.1,
                  }}
                >
                  Hoşgeldin!
                </h1>

                <div className="flex items-center justify-center gap-2 mt-3">
                  <div className="h-px w-8" style={{ background: "#FF5CA840" }} />
                  <span style={{ color: "#FF5CA8", fontSize: "12px" }}>❀</span>
                  <div className="h-px w-8" style={{ background: "#FF5CA840" }} />
                </div>
              </div>

              {/* Letter body */}
              <div
                className="space-y-4 mb-8"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  color: "#E9CFE8",
                  fontSize: "1.05rem",
                  lineHeight: 1.8,
                }}
              >
                <p style={{ color: "#BC6CFF" }}>Sevgili Ziyaretçimiz,</p>

                <p>
                  Sitemize hoş geldiniz! Semprexa olarak sizlere en güzel ürünleri sunmaya çalışıyoruz.
                </p>

                <p>
                  Sitemiz henüz <span className="neon-text-cyan" style={{ fontWeight: 600 }}>yeni</span> olduğu için bazı eksikler olabilir. Bu konuda anlayışınızı rica ediyoruz.
                </p>

                <p>
                  Önerileriniz ve düşünceleriniz bizim için çok değerli! Aşağıdaki hesaplarımızdan bize ulaşabilirsiniz:
                </p>

                {/* Contact cards */}
                <div className="space-y-3 pt-2">
                  <a
                    href="https://www.tiktok.com/@semprexaa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg transition-all hover:translate-x-1"
                    style={{
                      background: "linear-gradient(135deg, #FF5CA810, #00F0FF08)",
                      border: "1px solid #FF5CA830",
                    }}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#FF5CA820" }}>
                      <span style={{ fontSize: "1.2rem" }}>♪</span>
                    </div>
                    <div>
                      <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", color: "#FF5CA8", letterSpacing: "0.15em" }}>TIKTOK</p>
                      <p style={{ fontFamily: "var(--font-fuzzy)", color: "#E9CFE8", fontSize: "0.95rem" }}>@semprexaa</p>
                    </div>
                  </a>

                  <a
                    href="https://www.instagram.com/semprexa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg transition-all hover:translate-x-1"
                    style={{
                      background: "linear-gradient(135deg, #BC6CFF10, #FF5CA808)",
                      border: "1px solid #BC6CFF30",
                    }}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#BC6CFF20" }}>
                      <span style={{ fontSize: "1.2rem" }}>✿</span>
                    </div>
                    <div>
                      <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", color: "#BC6CFF", letterSpacing: "0.15em" }}>INSTAGRAM</p>
                      <p style={{ fontFamily: "var(--font-fuzzy)", color: "#E9CFE8", fontSize: "0.95rem" }}>@semprexa</p>
                    </div>
                  </a>

                  <a
                    href="mailto:semprexaa@gmail.com"
                    className="flex items-center gap-3 p-3 rounded-lg transition-all hover:translate-x-1"
                    style={{
                      background: "linear-gradient(135deg, #00F0FF10, #FFB86B08)",
                      border: "1px solid #00F0FF30",
                    }}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#00F0FF20" }}>
                      <span style={{ fontSize: "1.2rem" }}>✉</span>
                    </div>
                    <div>
                      <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", color: "#00F0FF", letterSpacing: "0.15em" }}>E-POSTA</p>
                      <p style={{ fontFamily: "var(--font-fuzzy)", color: "#E9CFE8", fontSize: "0.95rem" }}>semprexaa@gmail.com</p>
                    </div>
                  </a>
                </div>

                <p style={{ color: "#BC6CFF", textAlign: "center", marginTop: "1.5rem" }}>
                  Sevgilerimle,<br />
                  <span className="neon-text-pink" style={{ fontFamily: "var(--font-fuzzy)", fontSize: "1.1rem" }}>Semprexa Ekibi</span>
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={handleClose}
                className="w-full py-4 rounded-lg transition-all hover:translate-y-[-1px]"
                style={{
                  background: "linear-gradient(135deg, #FF5CA8, #BC6CFF)",
                  color: "#fff",
                  fontFamily: "var(--font-cinzel)",
                  fontSize: "11px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  border: "1px solid #FF5CA860",
                  boxShadow: "0 4px 20px #FF5CA840, 0 0 40px #BC6CFF20",
                  cursor: "pointer",
                }}
              >
                ✦ Alışverişe Başla ✦
              </button>
            </div>

            {/* Bottom shimmer */}
            <div
              className="h-1 w-full"
              style={{
                background: "linear-gradient(90deg, #FF5CA8, #BC6CFF, #00F0FF, #FFB86B, #FF5CA8)",
                backgroundSize: "200% 100%",
                animation: "shimmerLine 3s linear infinite",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
