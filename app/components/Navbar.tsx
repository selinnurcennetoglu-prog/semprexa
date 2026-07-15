"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthChange } from "../lib/auth";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; isAdmin: boolean } | null>(null);
  const [cartCount, setCartCount] = useState(0);

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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b" style={{ background: "rgba(11,15,43,0.95)", borderColor: "#BC6CFF20", backdropFilter: "blur(12px)" }}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.svg" alt="Semprexa" className="h-10 w-auto" />
          <span style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8", fontSize: "1.3rem", letterSpacing: "0.05em" }}>Semprexa</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/urunler" className="text-sm tracking-widest uppercase transition-colors" style={{ fontFamily: "var(--font-cinzel)", color: "#E9CFE8" }}>
            <span className="neon-text-cyan" style={{ fontSize: "inherit", letterSpacing: "inherit" }}>Ürünler</span>
          </Link>
          {user ? (
            <>
              <Link href="/sepet" className="relative text-sm tracking-widest uppercase transition-colors" style={{ fontFamily: "var(--font-cinzel)", color: "#E9CFE8" }}>
                <span className="neon-text-cyan" style={{ fontSize: "inherit", letterSpacing: "inherit" }}>Sepet</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-4 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "#FF5CA8", color: "#fff", boxShadow: "0 0 10px #FF5CA880" }}>
                    {cartCount}
                  </span>
                )}
              </Link>
              {user.isAdmin && <Link href="/admin" className="text-sm tracking-widest uppercase transition-colors" style={{ fontFamily: "var(--font-cinzel)" }}><span className="neon-text-purple" style={{ fontSize: "inherit", letterSpacing: "inherit" }}>Admin</span></Link>}
              <span className="text-xs neon-text-peach" style={{ fontFamily: "var(--font-cormorant)" }}>{user.name || user.email}</span>
              <button onClick={handleLogout} className="px-5 py-2 border text-xs tracking-widest uppercase transition-all" style={{ fontFamily: "var(--font-cinzel)", borderColor: "#FF5CA840", color: "#FF5CA8" }}>
                Çıkış
              </button>
            </>
          ) : (
            <>
              <Link href="/giris" className="text-sm tracking-widest uppercase transition-colors" style={{ fontFamily: "var(--font-cinzel)", color: "#E9CFE8" }}>
                <span className="neon-text-cyan" style={{ fontSize: "inherit", letterSpacing: "inherit" }}>Giriş</span>
              </Link>
              <Link href="/kayit" className="px-5 py-2 text-xs tracking-widest uppercase font-semibold transition-all" style={{ fontFamily: "var(--font-cinzel)", background: "linear-gradient(135deg, #FF5CA8, #BC6CFF)", color: "#fff", boxShadow: "0 2px 15px #FF5CA840" }}>Kayıt Ol</Link>
            </>
          )}
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-2xl neon-text-pink">{mobileOpen ? "✕" : "☰"}</button>
      </div>

      {mobileOpen && (
        <div className="md:hidden px-6 py-6 space-y-4 border-t" style={{ background: "rgba(11,15,43,0.98)", borderColor: "#BC6CFF20" }}>
          <Link href="/urunler" onClick={() => setMobileOpen(false)} className="block neon-text-cyan" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.1rem" }}>Ürünler</Link>
          {user ? (
            <>
              <Link href="/sepet" onClick={() => setMobileOpen(false)} className="block neon-text-cyan" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.1rem" }}>Sepet {cartCount > 0 && `(${cartCount})`}</Link>
              {user.isAdmin && <Link href="/admin" onClick={() => setMobileOpen(false)} className="block neon-text-purple" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.1rem" }}>Admin Panel</Link>}
              <button onClick={handleLogout} className="block neon-text-pink" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.1rem" }}>Çıkış Yap</button>
            </>
          ) : (
            <>
              <Link href="/giris" onClick={() => setMobileOpen(false)} className="block neon-text-cyan" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.1rem" }}>Giriş</Link>
              <Link href="/kayit" onClick={() => setMobileOpen(false)} className="block neon-text-pink" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.1rem" }}>Kayıt Ol</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
