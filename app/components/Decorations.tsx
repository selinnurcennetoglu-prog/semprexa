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
