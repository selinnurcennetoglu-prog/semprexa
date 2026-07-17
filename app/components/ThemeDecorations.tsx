"use client";

import { useState, useEffect } from "react";

function SkullSVG({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} fill="none">
      <ellipse cx="32" cy="28" rx="18" ry="20" fill="#80808030" stroke="#c0c0c040" strokeWidth="1.5" />
      <ellipse cx="24" cy="25" rx="5" ry="6" fill="#0a0a0a" stroke="#c0c0c050" strokeWidth="1" />
      <ellipse cx="40" cy="25" rx="5" ry="6" fill="#0a0a0a" stroke="#c0c0c050" strokeWidth="1" />
      <path d="M28 25 L22 22" stroke="#c0c0c040" strokeWidth="1" />
      <path d="M36 25 L42 22" stroke="#c0c0c040" strokeWidth="1" />
      <path d="M30 35 L28 40 L32 38 L36 40 L34 35" stroke="#c0c0c050" strokeWidth="1" fill="none" />
      <line x1="30" y1="33" x2="30" y2="42" stroke="#c0c0c040" strokeWidth="0.8" />
      <line x1="34" y1="33" x2="34" y2="42" stroke="#c0c0c040" strokeWidth="0.8" />
      <path d="M20 30 Q18 32 20 34" stroke="#c0c0c030" strokeWidth="1" fill="none" />
      <path d="M44 30 Q46 32 44 34" stroke="#c0c0c030" strokeWidth="1" fill="none" />
    </svg>
  );
}

function ChainSVG({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 30 120" className={className} style={style} fill="none">
      {[0, 18, 36, 54, 72, 90].map((y, i) => (
        <g key={i}>
          <ellipse cx="15" cy={y + 10} rx="8" ry="9" stroke="#80808050" strokeWidth="1.5" fill="none" />
          <ellipse cx="15" cy={y + 10} rx="4" ry="5" stroke="#60606040" strokeWidth="1" fill="none" />
        </g>
      ))}
    </svg>
  );
}

function FishSVG({ className, style, color = "#00b4d8" }: { className?: string; style?: React.CSSProperties; color?: string }) {
  return (
    <svg viewBox="0 0 60 40" className={className} style={style} fill="none">
      <ellipse cx="28" cy="20" rx="18" ry="10" fill={color + "30"} stroke={color + "60"} strokeWidth="1.5" />
      <path d="M46 20 L58 10 L58 30 Z" fill={color + "25"} stroke={color + "50"} strokeWidth="1" />
      <circle cx="20" cy="17" r="2" fill={color + "80"} />
      <circle cx="20" cy="17" r="0.8" fill="#0a1628" />
      <path d="M15 20 Q18 22 15 24" stroke={color + "40"} strokeWidth="0.8" />
      <path d="M22 14 Q25 12 28 14" stroke={color + "30"} strokeWidth="0.8" />
      <path d="M22 26 Q25 28 28 26" stroke={color + "30"} strokeWidth="0.8" />
    </svg>
  );
}

function OctopusSVG({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 80 90" className={className} style={style} fill="none">
      <ellipse cx="40" cy="28" rx="20" ry="18" fill="#48cae425" stroke="#48cae450" strokeWidth="1.5" />
      <circle cx="33" cy="25" r="3" fill="#48cae470" />
      <circle cx="47" cy="25" r="3" fill="#48cae470" />
      <circle cx="33" cy="25" r="1.2" fill="#0a1628" />
      <circle cx="47" cy="25" r="1.2" fill="#0a1628" />
      <path d="M36 33 Q40 36 44 33" stroke="#48cae440" strokeWidth="1" fill="none" />
      {[18, 26, 34, 42, 50, 58].map((x, i) => (
        <path key={i} className="animate-tentacle-sway" style={{ animationDelay: `${i * 0.3}s` }}
          d={`M${x} 42 Q${x + (i % 2 ? 5 : -5)} 60 ${x} 78`} stroke="#48cae440" strokeWidth="1.5" fill="none" />
      ))}
    </svg>
  );
}

function SeahorseSVG({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 40 70" className={className} style={style} fill="none">
      <path d="M20 8 Q28 8 28 16 Q28 24 22 28 Q18 30 18 36 Q18 42 22 48 Q26 54 24 60 Q22 64 18 60 Q14 56 16 52"
        stroke="#90e0ef50" strokeWidth="1.5" fill="#90e0ef15" />
      <circle cx="26" cy="14" r="1.5" fill="#90e0ef70" />
      <path d="M30 12 L36 8 L34 14 Z" fill="#90e0ef30" />
      <path d="M18 30 L12 28 L14 32" stroke="#90e0ef30" strokeWidth="1" fill="none" />
    </svg>
  );
}

function CrabSVG({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 70 50" className={className} style={style} fill="none">
      <ellipse cx="35" cy="28" rx="16" ry="12" fill="#e6394620" stroke="#e6394640" strokeWidth="1.5" />
      <circle cx="28" cy="22" r="2" fill="#e6394660" />
      <circle cx="42" cy="22" r="2" fill="#e6394660" />
      <path d="M18 24 L4 18 L8 24 L2 22 L6 28 Z" stroke="#e6394640" strokeWidth="1" fill="#e6394615" />
      <path d="M52 24 L66 18 L62 24 L68 22 L64 28 Z" stroke="#e6394640" strokeWidth="1" fill="#e6394615" />
      <path d="M20 38 L16 46" stroke="#e6394635" strokeWidth="1" />
      <path d="M26 40 L24 48" stroke="#e6394635" strokeWidth="1" />
      <path d="M44 40 L46 48" stroke="#e6394635" strokeWidth="1" />
      <path d="M50 38 L54 46" stroke="#e6394635" strokeWidth="1" />
    </svg>
  );
}

function SeaweedSVG({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 30 100" className={className} style={style} fill="none">
      <path d="M15 100 Q8 80 15 65 Q22 50 15 35 Q8 20 15 5" stroke="#2d6a4f50" strokeWidth="2" fill="none" />
      <path d="M12 80 Q5 72 10 65" stroke="#52b78840" strokeWidth="1.5" fill="none" />
      <path d="M18 60 Q25 52 20 45" stroke="#52b78840" strokeWidth="1.5" fill="none" />
      <path d="M12 45 Q5 38 10 30" stroke="#52b78835" strokeWidth="1.5" fill="none" />
      <ellipse cx="10" cy="72" rx="4" ry="3" fill="#52b78820" />
      <ellipse cx="20" cy="52" rx="4" ry="3" fill="#52b78820" />
    </svg>
  );
}

function BirdSVG({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 50 30" className={className} style={style} fill="none">
      <ellipse cx="25" cy="18" rx="8" ry="5" fill="#2d6a4f30" stroke="#52b78850" strokeWidth="1" />
      <circle cx="19" cy="16" r="1.5" fill="#52b78870" />
      <path d="M12 14 Q6 8 2 12" stroke="#52b78850" strokeWidth="1.2" fill="none" className="animate-wing-flap-bird" style={{ transformOrigin: "12px 14px" }} />
      <path d="M12 16 Q6 22 2 18" stroke="#52b78850" strokeWidth="1.2" fill="none" className="animate-wing-flap-bird" style={{ transformOrigin: "12px 16px", animationDelay: "0.15s" }} />
      <path d="M33 16 L40 18 L33 17" fill="#2d6a4f40" />
    </svg>
  );
}

function FlowerSVG({ className, style, color = "#52b788" }: { className?: string; style?: React.CSSProperties; color?: string }) {
  return (
    <svg viewBox="0 0 40 50" className={className} style={style} fill="none">
      <line x1="20" y1="22" x2="20" y2="48" stroke={color + "50"} strokeWidth="1.5" />
      <path d="M20 35 Q12 30 14 25" stroke={color + "40"} strokeWidth="1" fill={color + "15"} />
      <path d="M20 38 Q28 33 26 28" stroke={color + "40"} strokeWidth="1" fill={color + "15"} />
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <ellipse key={i} cx="20" cy="12" rx="3" ry="8" fill={color + "30"} stroke={color + "50"} strokeWidth="0.8"
          transform={`rotate(${angle} 20 18)`} />
      ))}
      <circle cx="20" cy="18" r="3" fill={color + "60"} />
    </svg>
  );
}

function TreeSVG({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 60 100" className={className} style={style} fill="none">
      <rect x="27" y="55" width="6" height="40" rx="2" fill="#8b735540" stroke="#8b735550" strokeWidth="1" />
      <ellipse cx="30" cy="35" rx="22" ry="25" fill="#2d6a4f20" stroke="#52b78840" strokeWidth="1" />
      <ellipse cx="22" cy="28" rx="12" ry="14" fill="#52b78815" />
      <ellipse cx="38" cy="30" rx="10" ry="12" fill="#74c69d12" />
    </svg>
  );
}

function BubbleSVG({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 20 20" className={className} style={style} fill="none">
      <circle cx="10" cy="10" r="8" fill="#48cae410" stroke="#48cae430" strokeWidth="0.8" />
      <ellipse cx="7" cy="7" rx="2" ry="1.5" fill="#48cae420" transform="rotate(-30 7 7)" />
    </svg>
  );
}

export default function ThemeDecorations() {
  const [theme, setTheme] = useState<string>("");

  useEffect(() => {
    const read = () => {
      try { setTheme(localStorage.getItem("semprexa_theme") || ""); } catch {}
    };
    read();
    const handler = () => read();
    window.addEventListener("storage", handler);
    const orig = localStorage.setItem;
    localStorage.setItem = function(k: string, v: string) { orig.call(this, k, v); if (k === "semprexa_theme") read(); };
    return () => { window.removeEventListener("storage", handler); localStorage.setItem = orig; };
  }, []);

  if (!theme) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {/* ═══ KARANLIK ═══ */}
      {theme === "karanlik" && (
        <>
          <SkullSVG className="absolute animate-skull-float animate-skull-glow" style={{ left: "5%", top: "15%", width: "50px", height: "50px", opacity: 0.2 }} />
          <SkullSVG className="absolute animate-skull-float animate-skull-glow" style={{ right: "8%", top: "25%", width: "40px", height: "40px", opacity: 0.15, animationDelay: "2s" }} />
          <SkullSVG className="absolute animate-skull-bob animate-skull-glow" style={{ left: "20%", bottom: "20%", width: "35px", height: "35px", opacity: 0.12, animationDelay: "1s" }} />
          <SkullSVG className="absolute animate-skull-float animate-skull-glow" style={{ right: "25%", bottom: "30%", width: "45px", height: "45px", opacity: 0.18, animationDelay: "3s" }} />
          <ChainSVG className="absolute animate-chain-dangle" style={{ left: "12%", top: "5%", width: "20px", height: "100px", opacity: 0.15 }} />
          <ChainSVG className="absolute animate-chain-dangle" style={{ right: "12%", top: "8%", width: "18px", height: "90px", opacity: 0.12, animationDelay: "1.5s" }} />
          <ChainSVG className="absolute animate-chain-swing" style={{ left: "40%", top: "3%", width: "16px", height: "80px", opacity: 0.1, animationDelay: "0.8s" }} />
          <ChainSVG className="absolute animate-chain-swing" style={{ right: "35%", top: "6%", width: "18px", height: "85px", opacity: 0.1, animationDelay: "2.2s" }} />
          {[15, 35, 55, 75, 90].map((left, i) => (
            <div key={i} className="absolute animate-chain-dangle" style={{ left: `${left}%`, top: "0", width: "2px", height: `${40 + i * 15}px`, background: "linear-gradient(180deg, #80808030, transparent)", opacity: 0.15, animationDelay: `${i * 0.5}s` }} />
          ))}
        </>
      )}

      {/* ═══ LACIVERT ═══ */}
      {theme === "lacivert" && (
        <>
          <FishSVG className="absolute animate-fish-swim" style={{ left: "5%", top: "20%", width: "55px", opacity: 0.25, animationDelay: "0s" }} />
          <FishSVG className="absolute animate-fish-swim-reverse" style={{ right: "8%", top: "35%", width: "45px", opacity: 0.2, animationDelay: "2s" }} color="#48cae4" />
          <FishSVG className="absolute animate-fish-swim" style={{ left: "30%", top: "60%", width: "38px", opacity: 0.18, animationDelay: "4s" }} color="#90e0ef" />
          <FishSVG className="absolute animate-fish-swim-reverse" style={{ right: "25%", top: "15%", width: "42px", opacity: 0.15, animationDelay: "1s" }} />
          <FishSVG className="absolute animate-fish-swim" style={{ left: "60%", top: "75%", width: "35px", opacity: 0.12, animationDelay: "3s" }} color="#48cae4" />
          <OctopusSVG className="absolute animate-octopus-wave" style={{ left: "8%", bottom: "10%", width: "70px", opacity: 0.2, animationDelay: "1s" }} />
          <SeahorseSVG className="absolute animate-seahorse-bob" style={{ right: "10%", bottom: "15%", width: "35px", opacity: 0.2, animationDelay: "0.5s" }} />
          <CrabSVG className="absolute animate-crab-walk" style={{ left: "35%", bottom: "5%", width: "55px", opacity: 0.18, animationDelay: "2s" }} />
          <SeaweedSVG className="absolute animate-seaweed-sway" style={{ left: "3%", bottom: "0", width: "25px", height: "90px", opacity: 0.2 }} />
          <SeaweedSVG className="absolute animate-seaweed-sway" style={{ left: "18%", bottom: "0", width: "22px", height: "80px", opacity: 0.15, animationDelay: "1s" }} />
          <SeaweedSVG className="absolute animate-seaweed-sway" style={{ right: "5%", bottom: "0", width: "28px", height: "95px", opacity: 0.2, animationDelay: "0.5s" }} />
          <SeaweedSVG className="absolute animate-seaweed-sway" style={{ right: "22%", bottom: "0", width: "20px", height: "70px", opacity: 0.12, animationDelay: "2s" }} />
          {[10, 25, 40, 55, 70, 85].map((left, i) => (
            <BubbleSVG key={i} className="absolute animate-bubble-rise" style={{ left: `${left}%`, bottom: `${10 + i * 5}%`, width: `${8 + i * 2}px`, opacity: 0.25, animationDelay: `${i * 0.7}s` }} />
          ))}
        </>
      )}

      {/* ═══ YESIL ═══ */}
      {theme === "yesil" && (
        <>
          <BirdSVG className="absolute animate-bird-fly" style={{ left: "10%", top: "12%", width: "50px", opacity: 0.25, animationDelay: "0s" }} />
          <BirdSVG className="absolute animate-bird-fly" style={{ right: "15%", top: "8%", width: "42px", opacity: 0.2, animationDelay: "3s" }} />
          <BirdSVG className="absolute animate-bird-fly" style={{ left: "40%", top: "20%", width: "38px", opacity: 0.15, animationDelay: "5s" }} />
          <FlowerSVG className="absolute animate-flower-sway" style={{ left: "5%", bottom: "15%", width: "35px", opacity: 0.25 }} />
          <FlowerSVG className="absolute animate-flower-sway" style={{ right: "8%", bottom: "20%", width: "30px", opacity: 0.2, animationDelay: "1s" }} />
          <FlowerSVG className="absolute animate-flower-sway" style={{ left: "25%", bottom: "10%", width: "28px", opacity: 0.18, animationDelay: "2s" }} color="#74c69d" />
          <FlowerSVG className="absolute animate-flower-sway" style={{ right: "30%", bottom: "8%", width: "32px", opacity: 0.15, animationDelay: "0.5s" }} color="#95d5b2" />
          <TreeSVG className="absolute animate-nature-glow" style={{ left: "2%", bottom: "0", width: "65px", opacity: 0.2 }} />
          <TreeSVG className="absolute animate-nature-glow" style={{ right: "3%", bottom: "0", width: "55px", opacity: 0.18, animationDelay: "2s" }} />
          {[8, 20, 35, 50, 65, 80, 92].map((left, i) => (
            <div key={i} className="absolute animate-petal-drift" style={{ left: `${left}%`, top: "-2%", width: "6px", height: "6px", background: i % 2 === 0 ? "#52b78840" : "#74c69d40", borderRadius: "50%", animationDelay: `${i * 1.5}s` }} />
          ))}
        </>
      )}

      {/* ═══ BEJ (mix of all) ═══ */}
      {theme === "bej" && (
        <>
          <SkullSVG className="absolute animate-skull-float animate-skull-glow" style={{ left: "3%", top: "12%", width: "38px", opacity: 0.12 }} />
          <ChainSVG className="absolute animate-chain-dangle" style={{ right: "8%", top: "5%", width: "14px", height: "70px", opacity: 0.1 }} />
          <FishSVG className="absolute animate-fish-swim" style={{ left: "15%", top: "30%", width: "40px", opacity: 0.15 }} color="#c9a96e" />
          <OctopusSVG className="absolute animate-octopus-wave" style={{ right: "5%", bottom: "20%", width: "55px", opacity: 0.12, animationDelay: "1s" }} />
          <SeahorseSVG className="absolute animate-seahorse-bob" style={{ left: "40%", bottom: "25%", width: "28px", opacity: 0.15, animationDelay: "0.5s" }} />
          <BirdSVG className="absolute animate-bird-fly" style={{ right: "20%", top: "10%", width: "42px", opacity: 0.18, animationDelay: "2s" }} />
          <FlowerSVG className="absolute animate-flower-sway" style={{ left: "25%", bottom: "12%", width: "30px", opacity: 0.15 }} color="#c9a96e" />
          <FlowerSVG className="absolute animate-flower-sway" style={{ right: "30%", bottom: "18%", width: "25px", opacity: 0.12, animationDelay: "1.5s" }} color="#d4b896" />
          <TreeSVG className="absolute animate-nature-glow" style={{ left: "50%", bottom: "0", width: "50px", opacity: 0.12, animationDelay: "1s" }} />
          <SeaweedSVG className="absolute animate-seaweed-sway" style={{ left: "60%", bottom: "0", width: "18px", height: "60px", opacity: 0.12 }} />
          {[12, 30, 48, 66, 84].map((left, i) => (
            <div key={i} className="absolute animate-petal-drift" style={{ left: `${left}%`, top: "-2%", width: "5px", height: "5px", background: "#c9a96e35", borderRadius: "50%", animationDelay: `${i * 2}s` }} />
          ))}
        </>
      )}
    </div>
  );
}
