"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { logoutUser } from "../lib/auth";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) setUser({ name: u.displayName || "", email: u.email || "" });
      else setUser(null);
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    window.location.href = "/";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-espresso/90 backdrop-blur-md border-b border-gold/10">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center">
          <img src="/logo.svg" alt="Semprexa" className="h-10 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/ilanlar" className="font-cormorant text-sm tracking-widest uppercase text-sand/60 hover:text-gold transition-colors">İlanlar</Link>
          {user ? (
            <>
              <Link href="/ilan/yeni" className="font-cormorant text-sm tracking-widest uppercase text-sand/60 hover:text-gold transition-colors">İlan Aç</Link>
              <Link href="/mesajlar" className="font-cormorant text-sm tracking-widest uppercase text-sand/60 hover:text-gold transition-colors">Mesajlar</Link>
              <span className="font-cormorant text-xs text-gold/40">{user.name || user.email}</span>
              <button onClick={handleLogout} className="px-5 py-2 border border-gold/30 text-gold text-xs tracking-widest uppercase hover:bg-gold/10 transition-all">Çıkış</button>
            </>
          ) : (
            <>
              <Link href="/giris" className="font-cormorant text-sm tracking-widest uppercase text-sand/60 hover:text-gold transition-colors">Giriş</Link>
              <Link href="/kayit" className="px-5 py-2 bg-gold text-espresso font-cinzel text-xs tracking-widest uppercase font-semibold hover:bg-gold-light transition-all">Kayıt Ol</Link>
            </>
          )}
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-gold text-2xl">{mobileOpen ? "✕" : "☰"}</button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-espresso border-t border-gold/10 px-6 py-6 space-y-4">
          <Link href="/ilanlar" onClick={() => setMobileOpen(false)} className="block font-cormorant text-sand/60 hover:text-gold">İlanlar</Link>
          {user ? (
            <>
              <Link href="/ilan/yeni" onClick={() => setMobileOpen(false)} className="block font-cormorant text-sand/60 hover:text-gold">İlan Aç</Link>
              <Link href="/mesajlar" onClick={() => setMobileOpen(false)} className="block font-cormorant text-sand/60 hover:text-gold">Mesajlar</Link>
              <button onClick={handleLogout} className="block font-cormorant text-red-400">Çıkış Yap</button>
            </>
          ) : (
            <>
              <Link href="/giris" onClick={() => setMobileOpen(false)} className="block font-cormorant text-sand/60 hover:text-gold">Giriş</Link>
              <Link href="/kayit" onClick={() => setMobileOpen(false)} className="block font-cormorant text-gold">Kayıt Ol</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
