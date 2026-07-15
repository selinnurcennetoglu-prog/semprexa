"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { logoutUser } from "../lib/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; isAdmin: boolean } | null>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        try {
          const snap = await getDoc(doc(db, "users", u.uid));
          const isAdmin = snap.exists() && snap.data().role === "admin";
          setUser({ name: u.displayName || "", email: u.email || "", isAdmin });
        } catch {
          setUser({ name: u.displayName || "", email: u.email || "", isAdmin: false });
        }
      } else setUser(null);
    });
    return () => unsub();
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b" style={{ background: "rgba(25,27,55,0.95)", borderColor: "#7C4EBB20", backdropFilter: "blur(12px)" }}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.svg" alt="Semprexa" className="h-10 w-auto" />
          <span style={{ fontFamily: "var(--font-yuyu)", color: "#E21C70", fontSize: "1.3rem", letterSpacing: "0.05em" }}>Semprexa</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/urunler" className="text-sm tracking-widest uppercase hover:text-[#E21C70] transition-colors" style={{ fontFamily: "var(--font-cinzel)", color: "#EDABBE" }}>Ürünler</Link>
          {user ? (
            <>
              <Link href="/sepet" className="relative text-sm tracking-widest uppercase hover:text-[#E21C70] transition-colors" style={{ fontFamily: "var(--font-cinzel)", color: "#EDABBE" }}>
                Sepet
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-4 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "#E21C70", color: "#fff" }}>
                    {cartCount}
                  </span>
                )}
              </Link>
              {user.isAdmin && <Link href="/admin" className="text-sm tracking-widest uppercase text-[#7C4EBB] hover:text-[#E21C70] transition-colors" style={{ fontFamily: "var(--font-cinzel)" }}>Admin</Link>}
              <span className="text-xs" style={{ fontFamily: "var(--font-cormorant)", color: "#872D72" }}>{user.name || user.email}</span>
              <button onClick={async () => { await logoutUser(); window.location.href = "/"; }} className="px-5 py-2 border text-xs tracking-widest uppercase hover:bg-[#E21C7015] transition-all" style={{ fontFamily: "var(--font-cinzel)", borderColor: "#E21C7040", color: "#E21C70" }}>
                Çıkış
              </button>
            </>
          ) : (
            <>
              <Link href="/giris" className="text-sm tracking-widest uppercase hover:text-[#E21C70] transition-colors" style={{ fontFamily: "var(--font-cinzel)", color: "#EDABBE" }}>Giriş</Link>
              <Link href="/kayit" className="px-5 py-2 text-xs tracking-widest uppercase font-semibold hover:bg-[#E21C70] transition-all" style={{ fontFamily: "var(--font-cinzel)", background: "#E21C70", color: "#fff" }}>Kayıt Ol</Link>
            </>
          )}
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-2xl" style={{ color: "#E21C70" }}>{mobileOpen ? "✕" : "☰"}</button>
      </div>

      {mobileOpen && (
        <div className="md:hidden px-6 py-6 space-y-4 border-t" style={{ background: "#191B37", borderColor: "#7C4EBB20" }}>
          <Link href="/urunler" onClick={() => setMobileOpen(false)} className="block" style={{ fontFamily: "var(--font-cormorant)", color: "#EDABBE" }}>Ürünler</Link>
          {user ? (
            <>
              <Link href="/sepet" onClick={() => setMobileOpen(false)} className="block" style={{ fontFamily: "var(--font-cormorant)", color: "#EDABBE" }}>Sepet {cartCount > 0 && `(${cartCount})`}</Link>
              {user.isAdmin && <Link href="/admin" onClick={() => setMobileOpen(false)} className="block" style={{ fontFamily: "var(--font-cormorant)", color: "#7C4EBB" }}>Admin Panel</Link>}
              <button onClick={async () => { await logoutUser(); window.location.href = "/"; }} className="block" style={{ fontFamily: "var(--font-cormorant)", color: "#E21C70" }}>Çıkış Yap</button>
            </>
          ) : (
            <>
              <Link href="/giris" onClick={() => setMobileOpen(false)} className="block" style={{ fontFamily: "var(--font-cormorant)", color: "#EDABBE" }}>Giriş</Link>
              <Link href="/kayit" onClick={() => setMobileOpen(false)} className="block" style={{ fontFamily: "var(--font-cormorant)", color: "#E21C70" }}>Kayıt Ol</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
