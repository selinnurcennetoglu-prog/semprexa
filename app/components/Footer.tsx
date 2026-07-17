"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "../lib/useTheme";

export default function Footer() {
  const { theme } = useTheme();
  const [userCount, setUserCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "userCount" }),
    })
      .then(r => r.json())
      .then(json => { if (json.count !== undefined) setUserCount(json.count); })
      .catch(() => {});
  }, []);

  return (
    <footer className="mt-auto py-10 px-4 text-center" style={{
      background: theme === "karanlik" ? "rgba(10,10,10,0.95)"
        : theme === "lacivert" ? "rgba(10,22,40,0.95)"
        : theme === "yesil" ? "rgba(10,26,18,0.95)"
        : theme === "pembe" ? "rgba(42,21,37,0.95)"
        : theme === "bej" ? "rgba(42,34,24,0.95)"
        : "rgba(11,15,43,0.95)",
      borderTop: "1px solid var(--theme-card-border)",
    }}>
      <div className="max-w-4xl mx-auto space-y-3">
        <p style={{ fontFamily: "var(--font-fuzzy)", color: "var(--theme-primary)", fontSize: "1.1rem" }}>
          ✦ Semprexa ✦
        </p>

        <p style={{ fontFamily: "var(--font-cormorant)", color: "var(--theme-secondary)", fontSize: "0.9rem" }}>
          Kuruluş: 2025
        </p>

        {userCount !== null && (
          <p style={{ fontFamily: "var(--font-cormorant)", color: "var(--theme-gold)", fontSize: "0.9rem" }}>
            {userCount} kayıtlı kullanıcı
          </p>
        )}

        <p style={{ fontFamily: "var(--font-cormorant)", color: "var(--theme-secondary)", fontSize: "0.9rem" }}>
          Contact:{" "}
          <a href="mailto:semprexaa@gmail.com" style={{ color: "var(--theme-accent)", textDecoration: "underline" }}>
            semprexaa@gmail.com
          </a>
        </p>

        <div className="flex justify-center gap-6 mt-4">
          <Link href="/gizlilik-politikasi"
            style={{ fontFamily: "var(--font-cinzel)", color: "var(--theme-secondary)", fontSize: "10px", letterSpacing: "0.1em" }}>
            Gizlilik Politikası
          </Link>
          <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: "var(--font-cinzel)", color: "var(--theme-secondary)", fontSize: "10px", letterSpacing: "0.1em" }}>
            TikTok
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: "var(--font-cinzel)", color: "var(--theme-secondary)", fontSize: "10px", letterSpacing: "0.1em" }}>
            Instagram
          </a>
        </div>

        <p style={{ fontFamily: "var(--font-cormorant)", color: "var(--theme-border)", fontSize: "0.75rem", marginTop: "16px" }}>
          &copy; {new Date().getFullYear()} Semprexa. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
