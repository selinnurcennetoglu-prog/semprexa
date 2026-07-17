"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthChange } from "../lib/auth";
import { useTheme } from "../lib/useTheme";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; isAdmin: boolean } | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      if (u) {
        setUser({ name: u.name, email: u.email, isAdmin: u.role === "admin" });
      } else setUser(null);
    });
    return () => { unsub.then(fn => fn()); };
  }, []);

  useEffect(() => {
    const updateCart = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("semprexa_cart") || "[]");
        setCartCount(cart.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0));
      } catch { setCartCount(0); }
    };
    updateCart();
    window.addEventListener("storage", updateCart);
    return () => window.removeEventListener("storage", updateCart);
  }, []);

  const handleLogout = async () => {
    const { logoutUser } = await import("../lib/auth");
    await logoutUser();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b" style={{
      background: theme === "karanlik" ? "rgba(10,10,10,0.95)"
        : theme === "lacivert" ? "rgba(10,22,40,0.95)"
        : theme === "yesil" ? "rgba(10,26,18,0.95)"
        : theme === "pembe" ? "rgba(42,21,37,0.95)"
        : theme === "bej" ? "rgba(42,34,24,0.95)"
        : "rgba(11,15,43,0.95)",
      borderColor: "var(--theme-card-border)",
      backdropFilter: "blur(12px)",
    }}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.svg" alt="Semprexa" className="h-10 w-auto" />
          <span style={{ fontFamily: "var(--font-fuzzy)", color: "var(--theme-primary)", fontSize: "1.3rem", letterSpacing: "0.05em" }}>Semprexa</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/urunler" className="text-sm tracking-widest uppercase transition-colors" style={{ fontFamily: "var(--font-cinzel)", color: "var(--theme-text)" }}>
            Ürünler
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm tracking-widest uppercase transition-colors" style={{ fontFamily: "var(--font-cinzel)", color: "var(--theme-text)" }}>
                Hesabım
              </Link>
              <Link href="/sepet" className="relative text-sm tracking-widest uppercase transition-colors" style={{ fontFamily: "var(--font-cinzel)", color: "var(--theme-text)" }}>
                Sepet
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-4 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "var(--theme-primary)", color: "#fff", boxShadow: "0 0 10px var(--theme-glow)" }}>
                    {cartCount}
                  </span>
                )}
              </Link>
              {user.isAdmin && <Link href="/admin" className="text-sm tracking-widest uppercase transition-colors" style={{ fontFamily: "var(--font-cinzel)", color: "var(--theme-accent)" }}>Admin</Link>}
              <span className="text-xs" style={{ fontFamily: "var(--font-cormorant)", color: "var(--theme-gold)" }}>{user.name || user.email}</span>
              <button onClick={handleLogout} className="px-5 py-2 border text-xs tracking-widest uppercase transition-all" style={{ fontFamily: "var(--font-cinzel)", borderColor: "var(--theme-border-hover)", color: "var(--theme-primary)" }}>
                Çıkış
              </button>
            </>
          ) : (
            <>
              <Link href="/giris" className="text-sm tracking-widest uppercase transition-colors" style={{ fontFamily: "var(--font-cinzel)", color: "var(--theme-text)" }}>
                Giriş
              </Link>
              <Link href="/kayit" className="px-5 py-2 text-xs tracking-widest uppercase font-semibold transition-all" style={{ fontFamily: "var(--font-cinzel)", background: "var(--theme-gradient)", color: "#fff", boxShadow: "0 2px 15px var(--theme-glow)" }}>Kayıt Ol</Link>
            </>
          )}
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-2xl" style={{ color: "var(--theme-primary)" }}>{mobileOpen ? "✕" : "☰"}</button>
      </div>

      {mobileOpen && (
        <div className="md:hidden px-6 py-6 space-y-4 border-t" style={{
          background: theme === "karanlik" ? "rgba(10,10,10,0.98)"
            : theme === "lacivert" ? "rgba(10,22,40,0.98)"
            : theme === "yesil" ? "rgba(10,26,18,0.98)"
            : theme === "pembe" ? "rgba(42,21,37,0.98)"
            : theme === "bej" ? "rgba(42,34,24,0.98)"
            : "rgba(11,15,43,0.98)",
          borderColor: "var(--theme-card-border)",
        }}>
          <Link href="/urunler" onClick={() => setMobileOpen(false)} className="block" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.1rem", color: "var(--theme-secondary)" }}>Ürünler</Link>
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.1rem", color: "var(--theme-secondary)" }}>Hesabım</Link>
              <Link href="/sepet" onClick={() => setMobileOpen(false)} className="block" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.1rem", color: "var(--theme-secondary)" }}>Sepet {cartCount > 0 && `(${cartCount})`}</Link>
              {user.isAdmin && <Link href="/admin" onClick={() => setMobileOpen(false)} className="block" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.1rem", color: "var(--theme-accent)" }}>Admin Panel</Link>}
              <button onClick={handleLogout} className="block" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.1rem", color: "var(--theme-primary)" }}>Çıkış Yap</button>
            </>
          ) : (
            <>
              <Link href="/giris" onClick={() => setMobileOpen(false)} className="block" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.1rem", color: "var(--theme-secondary)" }}>Giriş</Link>
              <Link href="/kayit" onClick={() => setMobileOpen(false)} className="block" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.1rem", color: "var(--theme-primary)" }}>Kayıt Ol</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
