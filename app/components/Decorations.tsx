export function LilyFlower({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 50 L40 115" stroke="#7C4EBB" strokeWidth="2" opacity="0.4"/>
      <path d="M40 80 C30 75, 15 70, 10 65" stroke="#7C4EBB" strokeWidth="1" opacity="0.3" fill="none"/>
      <path d="M40 95 C50 90, 65 85, 70 80" stroke="#7C4EBB" strokeWidth="1" opacity="0.3" fill="none"/>
      <ellipse cx="10" cy="65" rx="8" ry="5" fill="#7C4EBB" opacity="0.15" transform="rotate(-30 10 65)"/>
      <ellipse cx="70" cy="80" rx="8" ry="5" fill="#7C4EBB" opacity="0.15" transform="rotate(30 70 80)"/>
      <ellipse cx="40" cy="48" rx="8" ry="22" fill="#E21C70" opacity="0.3" transform="rotate(-15 40 48)"/>
      <ellipse cx="40" cy="48" rx="8" ry="22" fill="#F966AB" opacity="0.25" transform="rotate(15 40 48)"/>
      <ellipse cx="40" cy="48" rx="7" ry="20" fill="#EDABBE" opacity="0.2" transform="rotate(45 40 48)"/>
      <ellipse cx="40" cy="48" rx="7" ry="20" fill="#DE5C8F" opacity="0.2" transform="rotate(-45 40 48)"/>
      <ellipse cx="40" cy="48" rx="6" ry="18" fill="#872D72" opacity="0.15" transform="rotate(80 40 48)"/>
      <ellipse cx="40" cy="48" rx="6" ry="18" fill="#872D72" opacity="0.15" transform="rotate(-80 40 48)"/>
      <circle cx="40" cy="48" r="4" fill="#F966AB" opacity="0.5"/>
      <circle cx="40" cy="48" r="2" fill="#EDABBE" opacity="0.6"/>
    </svg>
  );
}

export function LilySmall({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="16" rx="4" ry="10" fill="#E21C70" opacity="0.2" transform="rotate(-20 20 16)"/>
      <ellipse cx="20" cy="16" rx="4" ry="10" fill="#F966AB" opacity="0.18" transform="rotate(20 20 16)"/>
      <ellipse cx="20" cy="16" rx="3.5" ry="9" fill="#EDABBE" opacity="0.15" transform="rotate(50 20 16)"/>
      <ellipse cx="20" cy="16" rx="3.5" ry="9" fill="#DE5C8F" opacity="0.15" transform="rotate(-50 20 16)"/>
      <circle cx="20" cy="16" r="2.5" fill="#F966AB" opacity="0.35"/>
      <path d="M20 22 L20 38" stroke="#7C4EBB" strokeWidth="1" opacity="0.25"/>
    </svg>
  );
}
