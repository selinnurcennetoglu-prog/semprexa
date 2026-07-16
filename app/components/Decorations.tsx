"use client";

export function LilyLarge({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 140 L100 290" stroke="#BC6CFF" strokeWidth="3" opacity="0.3"/>
      <path d="M100 180 C80 170, 50 160, 35 155" stroke="#BC6CFF" strokeWidth="2" opacity="0.25" fill="none"/>
      <path d="M100 220 C120 210, 150 200, 165 195" stroke="#BC6CFF" strokeWidth="2" opacity="0.25" fill="none"/>
      <path d="M100 260 C85 255, 60 250, 45 245" stroke="#BC6CFF" strokeWidth="1.5" opacity="0.2" fill="none"/>
      <ellipse cx="35" cy="155" rx="15" ry="8" fill="#BC6CFF" opacity="0.15" transform="rotate(-30 35 155)"/>
      <ellipse cx="165" cy="195" rx="15" ry="8" fill="#BC6CFF" opacity="0.15" transform="rotate(25 165 195)"/>
      <ellipse cx="45" cy="245" rx="12" ry="6" fill="#BC6CFF" opacity="0.12" transform="rotate(-20 45 245)"/>
      <ellipse cx="100" cy="100" rx="18" ry="55" fill="#FF5CA8" opacity="0.35" transform="rotate(-12 100 100)"/>
      <ellipse cx="100" cy="100" rx="18" ry="55" fill="#FFB86B" opacity="0.25" transform="rotate(12 100 100)"/>
      <ellipse cx="100" cy="100" rx="16" ry="50" fill="#00F0FF" opacity="0.2" transform="rotate(40 100 100)"/>
      <ellipse cx="100" cy="100" rx="16" ry="50" fill="#BC6CFF" opacity="0.2" transform="rotate(-40 100 100)"/>
      <ellipse cx="100" cy="100" rx="14" ry="45" fill="#FF5CA8" opacity="0.15" transform="rotate(70 100 100)"/>
      <ellipse cx="100" cy="100" rx="14" ry="45" fill="#FFB86B" opacity="0.12" transform="rotate(-70 100 100)"/>
      <circle cx="100" cy="100" r="8" fill="#FF5CA8" opacity="0.5"/>
      <circle cx="100" cy="100" r="4" fill="#00F0FF" opacity="0.6"/>
      <line x1="100" y1="100" x2="80" y2="70" stroke="#BC6CFF" strokeWidth="1" opacity="0.3"/>
      <line x1="100" y1="100" x2="120" y2="70" stroke="#BC6CFF" strokeWidth="1" opacity="0.3"/>
      <line x1="100" y1="100" x2="100" y2="65" stroke="#BC6CFF" strokeWidth="1" opacity="0.3"/>
      <circle cx="80" cy="70" r="3" fill="#FF5CA8" opacity="0.4"/>
      <circle cx="120" cy="70" r="3" fill="#00F0FF" opacity="0.4"/>
      <circle cx="100" cy="65" r="3" fill="#BC6CFF" opacity="0.4"/>
    </svg>
  );
}

export function LilyMedium({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 120 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M60 85 L60 175" stroke="#BC6CFF" strokeWidth="2" opacity="0.25"/>
      <path d="M60 120 C48 115, 30 108, 22 105" stroke="#BC6CFF" strokeWidth="1.5" opacity="0.2" fill="none"/>
      <ellipse cx="22" cy="105" rx="10" ry="6" fill="#BC6CFF" opacity="0.12" transform="rotate(-25 22 105)"/>
      <ellipse cx="60" cy="60" rx="12" ry="35" fill="#FF5CA8" opacity="0.3" transform="rotate(-15 60 60)"/>
      <ellipse cx="60" cy="60" rx="12" ry="35" fill="#00F0FF" opacity="0.22" transform="rotate(15 60 60)"/>
      <ellipse cx="60" cy="60" rx="10" ry="30" fill="#FFB86B" opacity="0.2" transform="rotate(45 60 60)"/>
      <ellipse cx="60" cy="60" rx="10" ry="30" fill="#BC6CFF" opacity="0.18" transform="rotate(-45 60 60)"/>
      <ellipse cx="60" cy="60" rx="8" ry="25" fill="#FF5CA8" opacity="0.15" transform="rotate(75 60 60)"/>
      <circle cx="60" cy="60" r="5" fill="#FF5CA8" opacity="0.45"/>
      <circle cx="60" cy="60" r="2.5" fill="#00F0FF" opacity="0.5"/>
    </svg>
  );
}

export function LilySmall({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 38 L30 78" stroke="#BC6CFF" strokeWidth="1" opacity="0.2"/>
      <ellipse cx="30" cy="25" rx="6" ry="18" fill="#FF5CA8" opacity="0.3" transform="rotate(-18 30 25)"/>
      <ellipse cx="30" cy="25" rx="6" ry="18" fill="#00F0FF" opacity="0.22" transform="rotate(18 30 25)"/>
      <ellipse cx="30" cy="25" rx="5" ry="15" fill="#FFB86B" opacity="0.2" transform="rotate(50 30 25)"/>
      <ellipse cx="30" cy="25" rx="5" ry="15" fill="#BC6CFF" opacity="0.18" transform="rotate(-50 30 25)"/>
      <circle cx="30" cy="25" r="3" fill="#FF5CA8" opacity="0.4"/>
      <circle cx="30" cy="25" r="1.5" fill="#00F0FF" opacity="0.5"/>
    </svg>
  );
}

export function PetalFloat({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="15" cy="15" rx="6" ry="12" fill="#FF5CA8" opacity="0.25" transform="rotate(30 15 15)"/>
      <ellipse cx="15" cy="15" rx="5" ry="10" fill="#00F0FF" opacity="0.15" transform="rotate(-20 15 15)"/>
    </svg>
  );
}

export function Butterfly({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="22" cy="25" rx="18" ry="14" fill="#FF5CA8" opacity="0.35" transform="rotate(-15 22 25)"/>
      <ellipse cx="58" cy="25" rx="18" ry="14" fill="#FF5CA8" opacity="0.35" transform="rotate(15 58 25)"/>
      <ellipse cx="22" cy="38" rx="12" ry="10" fill="#00F0FF" opacity="0.3" transform="rotate(-10 22 38)"/>
      <ellipse cx="58" cy="38" rx="12" ry="10" fill="#00F0FF" opacity="0.3" transform="rotate(10 58 38)"/>
      <ellipse cx="22" cy="25" rx="10" ry="8" fill="#BC6CFF" opacity="0.25" transform="rotate(-15 22 25)"/>
      <ellipse cx="58" cy="25" rx="10" ry="8" fill="#BC6CFF" opacity="0.25" transform="rotate(15 58 25)"/>
      <ellipse cx="22" cy="38" rx="6" ry="5" fill="#FFB86B" opacity="0.2" transform="rotate(-10 22 38)"/>
      <ellipse cx="58" cy="38" rx="6" ry="5" fill="#FFB86B" opacity="0.2" transform="rotate(10 58 38)"/>
      <circle cx="22" cy="25" r="3" fill="#00F0FF" opacity="0.4"/>
      <circle cx="58" cy="25" r="3" fill="#00F0FF" opacity="0.4"/>
      <circle cx="22" cy="38" r="2" fill="#FFB86B" opacity="0.35"/>
      <circle cx="58" cy="38" r="2" fill="#FFB86B" opacity="0.35"/>
      <line x1="40" y1="20" x2="40" y2="45" stroke="#BC6CFF" strokeWidth="1.5" opacity="0.4"/>
      <line x1="40" y1="22" x2="35" y2="14" stroke="#BC6CFF" strokeWidth="0.8" opacity="0.3"/>
      <line x1="40" y1="22" x2="45" y2="14" stroke="#BC6CFF" strokeWidth="0.8" opacity="0.3"/>
      <circle cx="35" cy="13" r="1.5" fill="#FF5CA8" opacity="0.5"/>
      <circle cx="45" cy="13" r="1.5" fill="#FF5CA8" opacity="0.5"/>
    </svg>
  );
}

export function IvyVine({ className, style, variant = "left" }: { className?: string; style?: React.CSSProperties; variant?: "left" | "right" | "top" }) {
  const flip = variant === "right" ? "scaleX(-1)" : variant === "top" ? "rotate(90deg)" : "none";
  return (
    <svg className={className} style={{ ...style, transform: `${style?.transform || ""} ${flip}`.trim() }} viewBox="0 0 120 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M60 0 C60 40, 40 80, 50 120 C60 160, 80 180, 70 220 C60 260, 30 280, 40 320 C50 360, 60 380, 60 400" stroke="#00F0FF" strokeWidth="2" opacity="0.3" fill="none" className="vine-main"/>
      <path d="M50 120 C30 110, 15 100, 8 90" stroke="#00F0FF" strokeWidth="1.5" opacity="0.25" fill="none"/>
      <path d="M70 220 C90 210, 105 200, 112 190" stroke="#00F0FF" strokeWidth="1.5" opacity="0.25" fill="none"/>
      <path d="M40 320 C20 310, 8 300, 5 290" stroke="#00F0FF" strokeWidth="1.5" opacity="0.25" fill="none"/>
      <ellipse cx="8" cy="90" rx="12" ry="8" fill="#00F0FF" opacity="0.2" transform="rotate(-40 8 90)"/>
      <ellipse cx="112" cy="190" rx="12" ry="8" fill="#FF5CA8" opacity="0.2" transform="rotate(40 112 190)"/>
      <ellipse cx="5" cy="290" rx="10" ry="7" fill="#BC6CFF" opacity="0.18" transform="rotate(-35 5 290)"/>
      <path d="M60 40 C45 35, 25 30, 15 35" stroke="#00F0FF" strokeWidth="1" opacity="0.2" fill="none"/>
      <ellipse cx="15" cy="35" rx="8" ry="5" fill="#FFB86B" opacity="0.15" transform="rotate(-20 15 35)"/>
      <path d="M70 160 C85 155, 100 150, 108 155" stroke="#FF5CA8" strokeWidth="1" opacity="0.2" fill="none"/>
      <ellipse cx="108" cy="155" rx="8" ry="5" fill="#FF5CA8" opacity="0.15" transform="rotate(25 108 155)"/>
      <path d="M45 260 C30 255, 18 250, 10 255" stroke="#BC6CFF" strokeWidth="1" opacity="0.18" fill="none"/>
      <ellipse cx="10" cy="255" rx="7" ry="4" fill="#00F0FF" opacity="0.12" transform="rotate(-30 10 255)"/>
      <circle cx="50" cy="120" r="3" fill="#FF5CA8" opacity="0.25"/>
      <circle cx="70" cy="220" r="2.5" fill="#00F0FF" opacity="0.25"/>
      <circle cx="40" cy="320" r="2" fill="#BC6CFF" opacity="0.2"/>
      <path d="M55 80 C40 75, 20 70, 12 65" stroke="#BC6CFF" strokeWidth="0.8" opacity="0.15" fill="none"/>
      <ellipse cx="12" cy="65" rx="6" ry="4" fill="#FFB86B" opacity="0.1" transform="rotate(-25 12 65)"/>
      <path d="M65 200 C80 195, 95 190, 102 185" stroke="#FFB86B" strokeWidth="0.8" opacity="0.15" fill="none"/>
      <ellipse cx="102" cy="185" rx="6" ry="4" fill="#BC6CFF" opacity="0.1" transform="rotate(20 102 185)"/>
    </svg>
  );
}

export function NeonTree({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 200 350" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 350 L100 200" stroke="#411E57" strokeWidth="8" opacity="0.4"/>
      <path d="M100 200 C100 180, 80 160, 60 140" stroke="#411E57" strokeWidth="5" opacity="0.35" fill="none"/>
      <path d="M100 200 C100 175, 120 155, 140 135" stroke="#411E57" strokeWidth="5" opacity="0.35" fill="none"/>
      <path d="M100 250 C85 240, 60 230, 40 225" stroke="#411E57" strokeWidth="3" opacity="0.3" fill="none"/>
      <path d="M100 280 C115 275, 140 268, 160 262" stroke="#411E57" strokeWidth="3" opacity="0.3" fill="none"/>
      <ellipse cx="60" cy="100" rx="45" ry="50" fill="#00F0FF" opacity="0.08"/>
      <ellipse cx="140" cy="95" rx="40" ry="45" fill="#FF5CA8" opacity="0.08"/>
      <ellipse cx="100" cy="80" rx="50" ry="55" fill="#BC6CFF" opacity="0.07"/>
      <ellipse cx="75" cy="110" rx="35" ry="40" fill="#FFB86B" opacity="0.06"/>
      <ellipse cx="125" cy="105" rx="35" ry="40" fill="#00F0FF" opacity="0.06"/>
      <ellipse cx="60" cy="140" rx="8" ry="5" fill="#00F0FF" opacity="0.15" transform="rotate(-30 60 140)"/>
      <ellipse cx="140" cy="135" rx="8" ry="5" fill="#FF5CA8" opacity="0.15" transform="rotate(30 140 135)"/>
      <ellipse cx="40" cy="225" rx="10" ry="6" fill="#BC6CFF" opacity="0.12" transform="rotate(-20 40 225)"/>
      <ellipse cx="160" cy="262" rx="10" ry="6" fill="#FFB86B" opacity="0.12" transform="rotate(15 160 262)"/>
      <circle cx="55" cy="90" r="4" fill="#FF5CA8" opacity="0.2"/>
      <circle cx="145" cy="85" r="3.5" fill="#00F0FF" opacity="0.2"/>
      <circle cx="100" cy="75" r="4.5" fill="#BC6CFF" opacity="0.18"/>
      <circle cx="80" cy="100" r="3" fill="#FFB86B" opacity="0.18"/>
      <circle cx="120" cy="95" r="3" fill="#FF5CA8" opacity="0.15"/>
      <circle cx="70" cy="115" r="2.5" fill="#00F0FF" opacity="0.15"/>
      <circle cx="130" cy="110" r="2.5" fill="#BC6CFF" opacity="0.15"/>
      <circle cx="90" cy="70" r="2" fill="#FF5CA8" opacity="0.12"/>
      <circle cx="110" cy="68" r="2" fill="#00F0FF" opacity="0.12"/>
    </svg>
  );
}

export function RoseFlower({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 50 L40 95" stroke="#BC6CFF" strokeWidth="2" opacity="0.25"/>
      <path d="M40 70 C30 65, 18 60, 12 58" stroke="#BC6CFF" strokeWidth="1.2" opacity="0.2" fill="none"/>
      <ellipse cx="12" cy="58" rx="8" ry="5" fill="#00F0FF" opacity="0.12" transform="rotate(-25 12 58)"/>
      <ellipse cx="40" cy="35" rx="14" ry="18" fill="#FF5CA8" opacity="0.3" transform="rotate(0 40 35)"/>
      <ellipse cx="40" cy="35" rx="12" ry="16" fill="#FF5CA8" opacity="0.25" transform="rotate(60 40 35)"/>
      <ellipse cx="40" cy="35" rx="12" ry="16" fill="#FF5CA8" opacity="0.2" transform="rotate(120 40 35)"/>
      <ellipse cx="40" cy="35" rx="10" ry="14" fill="#BC6CFF" opacity="0.15" transform="rotate(30 40 35)"/>
      <ellipse cx="40" cy="35" rx="10" ry="14" fill="#BC6CFF" opacity="0.12" transform="rotate(90 40 35)"/>
      <ellipse cx="40" cy="35" rx="10" ry="14" fill="#BC6CFF" opacity="0.1" transform="rotate(150 40 35)"/>
      <circle cx="40" cy="35" r="5" fill="#FF5CA8" opacity="0.35"/>
      <circle cx="40" cy="35" r="2.5" fill="#00F0FF" opacity="0.4"/>
    </svg>
  );
}

export function DaisyFlower({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 70 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M35 42 L35 85" stroke="#BC6CFF" strokeWidth="1.5" opacity="0.2"/>
      <ellipse cx="35" cy="18" rx="5" ry="12" fill="#E9CFE8" opacity="0.25"/>
      <ellipse cx="35" cy="18" rx="5" ry="12" fill="#E9CFE8" opacity="0.2" transform="rotate(45 35 18)"/>
      <ellipse cx="35" cy="18" rx="5" ry="12" fill="#E9CFE8" opacity="0.2" transform="rotate(90 35 18)"/>
      <ellipse cx="35" cy="18" rx="5" ry="12" fill="#E9CFE8" opacity="0.2" transform="rotate(135 35 18)"/>
      <ellipse cx="35" cy="18" rx="4" ry="10" fill="#FFB86B" opacity="0.15" transform="rotate(22 35 18)"/>
      <ellipse cx="35" cy="18" rx="4" ry="10" fill="#FFB86B" opacity="0.12" transform="rotate(67 35 18)"/>
      <ellipse cx="35" cy="18" rx="4" ry="10" fill="#FFB86B" opacity="0.1" transform="rotate(112 35 18)"/>
      <ellipse cx="35" cy="18" rx="4" ry="10" fill="#FFB86B" opacity="0.1" transform="rotate(157 35 18)"/>
      <circle cx="35" cy="18" r="6" fill="#FFB86B" opacity="0.3"/>
      <circle cx="35" cy="18" r="3" fill="#FF5CA8" opacity="0.35"/>
    </svg>
  );
}

export function Rosebud({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 50 70" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 35 L25 65" stroke="#BC6CFF" strokeWidth="1.5" opacity="0.2"/>
      <ellipse cx="25" cy="22" rx="8" ry="14" fill="#FF5CA8" opacity="0.3" transform="rotate(-5 25 22)"/>
      <ellipse cx="25" cy="22" rx="7" ry="12" fill="#FF5CA8" opacity="0.25" transform="rotate(15 25 22)"/>
      <ellipse cx="25" cy="22" rx="6" ry="10" fill="#BC6CFF" opacity="0.15" transform="rotate(35 25 22)"/>
      <ellipse cx="25" cy="22" rx="5" ry="8" fill="#FFB86B" opacity="0.12" transform="rotate(55 25 22)"/>
      <circle cx="25" cy="22" r="3" fill="#FF5CA8" opacity="0.3"/>
      <path d="M25 35 C20 33, 12 30, 8 28" stroke="#00F0FF" strokeWidth="0.8" opacity="0.15" fill="none"/>
      <ellipse cx="8" cy="28" rx="5" ry="3" fill="#00F0FF" opacity="0.1" transform="rotate(-20 8 28)"/>
    </svg>
  );
}

export function LeafCluster({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="15" cy="20" rx="12" ry="6" fill="#00F0FF" opacity="0.15" transform="rotate(-30 15 20)"/>
      <ellipse cx="30" cy="18" rx="10" ry="5" fill="#FF5CA8" opacity="0.12" transform="rotate(10 30 18)"/>
      <ellipse cx="45" cy="22" rx="11" ry="5.5" fill="#BC6CFF" opacity="0.12" transform="rotate(25 45 22)"/>
      <line x1="15" y1="20" x2="5" y2="15" stroke="#00F0FF" strokeWidth="0.5" opacity="0.15"/>
      <line x1="30" y1="18" x2="22" y2="12" stroke="#FF5CA8" strokeWidth="0.5" opacity="0.12"/>
      <line x1="45" y1="22" x2="55" y2="17" stroke="#BC6CFF" strokeWidth="0.5" opacity="0.12"/>
    </svg>
  );
}
