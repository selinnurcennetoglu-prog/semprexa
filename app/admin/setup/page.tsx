"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDocs, collection, query, where } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";

function LeafSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 5 C25 10, 35 15, 35 25 C35 32, 28 37, 20 37 C12 37, 5 32, 5 25 C5 15, 15 10, 20 5Z" fill="#6b8f5e" opacity="0.12"/>
      <path d="M20 5 L20 37" stroke="#6b8f5e" strokeWidth="0.5" opacity="0.18"/>
      <path d="M20 12 L12 20 M20 18 L28 24 M20 25 L14 30" stroke="#6b8f5e" strokeWidth="0.3" opacity="0.12"/>
    </svg>
  );
}

function VineSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M60 0 C60 40, 20 60, 30 100 S80 140, 60 180 S20 220, 40 260 S80 300, 60 340 S30 370, 60 400" stroke="#6b8f5e" strokeWidth="2" opacity="0.25" fill="none"/>
      <ellipse cx="5" cy="70" rx="10" ry="6" fill="#6b8f5e" opacity="0.1" transform="rotate(-30 5 70)"/>
      <ellipse cx="90" cy="195" rx="10" ry="6" fill="#6b8f5e" opacity="0.1" transform="rotate(20 90 195)"/>
      <ellipse cx="15" cy="230" rx="10" ry="6" fill="#6b8f5e" opacity="0.1" transform="rotate(-25 15 230)"/>
    </svg>
  );
}

function Sparkles() {
  const dots = Array.from({ length: 12 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    size: `${3 + Math.random() * 4}px`,
    color: Math.random() > 0.5 ? "#c96b8b" : "#dbc48a",
  }));
  return (
    <>
      {dots.map((d, i) => (
        <div
          key={i}
          className="sparkle-dot"
          style={{ left: d.left, top: d.top, animationDelay: d.delay, width: d.size, height: d.size, background: `radial-gradient(circle, ${d.color}80, ${d.color}40, transparent)` }}
        />
      ))}
    </>
  );
}

export default function AdminSetupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleCreate = async () => {
    setError("");
    if (!name || !email || !password) return setError("Tüm alanları doldurun.");
    if (password.length < 8) return setError("Şifre en az 8 karakter olmalı.");

    setLoading(true);

    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const existing = await getDocs(q);
      if (!existing.empty) {
        setError("Bu e-posta zaten kayıtlı. Giriş yapıp Firestore'dan role admin verin.");
        setLoading(false);
        return;
      }

      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });

      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        name,
        email,
        phone: "",
        role: "admin",
        createdAt: new Date().toISOString(),
        phoneVerified: true,
      });

      setDone(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Hata";
      if (msg.includes("email-already-in-use")) setError("Bu e-posta zaten kayıtlı.");
      else if (msg.includes("weak-password")) setError("Şifre çok zayıf.");
      else setError(msg);
    }

    setLoading(false);
  };

  if (done) {
    return (
      <main className="admin-fairytale flex items-center justify-center relative">
        <Sparkles />
        <div className="vine-decoration left-4 top-0 w-16 h-80 opacity-30 hidden lg:block">
          <VineSVG className="w-full h-full" />
        </div>
        <div className="vine-decoration right-4 top-20 w-16 h-80 opacity-25 hidden lg:block" style={{ animationDelay: "1.5s" }}>
          <VineSVG className="w-full h-full transform scale-x-[-1]" />
        </div>
        <div className="relative z-10 max-w-lg text-center">
          <div className="fairytale-frame rounded-sm p-10 bg-gradient-to-br from-[#faf5ee] to-[#f0e0d0]">
            <div className="text-5xl mb-6">👑</div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <LeafSVG className="w-6 h-6 opacity-50" />
              <span className="font-cinzel text-[10px] tracking-[0.5em] uppercase" style={{ color: "#c96b8b" }}>
                Kraliçe Tahta Çıktı
              </span>
              <LeafSVG className="w-6 h-6 opacity-50 transform scale-x-[-1]" />
            </div>
            <h1 className="font-playfair text-3xl font-bold mb-4" style={{ color: "#5a2a3a" }}>
              Admin Hesabı <span style={{ color: "#c96b8b" }}>Oluşturuldu!</span>
            </h1>
            <p className="font-cormorant mb-8" style={{ color: "#8b7a6b" }}>
              ✦ Artık admin olarak giriş yapabilirsiniz ✦
            </p>
            <Link href="/admin/giris" className="fairytale-btn inline-block px-8 py-4 rounded-sm font-cinzel text-xs tracking-[0.25em] uppercase font-semibold">
              ✦ Admin Girişi
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-fairytale relative">
      <Sparkles />

      <div className="vine-decoration left-4 top-0 w-16 h-80 opacity-30 hidden lg:block">
        <VineSVG className="w-full h-full" />
      </div>
      <div className="vine-decoration right-4 top-20 w-16 h-80 opacity-25 hidden lg:block" style={{ animationDelay: "1.5s" }}>
        <VineSVG className="w-full h-full transform scale-x-[-1]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <LeafSVG className="w-8 h-8 opacity-50" />
            <span className="font-cinzel text-[10px] tracking-[0.5em] uppercase" style={{ color: "#c96b8b" }}>
              İlk Kurulum
            </span>
            <LeafSVG className="w-8 h-8 opacity-50 transform scale-x-[-1]" />
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold" style={{ color: "#5a2a3a" }}>
            Admin <span style={{ color: "#c96b8b" }}>Hesabı Oluştur</span>
          </h1>
          <p className="font-cormorant text-sm mt-3" style={{ color: "#8b7a6b" }}>✦ Perilerin sarayının anahtarı ✦</p>
        </div>

        <div className="fairytale-frame rounded-sm p-8 md:p-10 bg-gradient-to-br from-[#faf5ee] to-[#f0e0d0] max-w-lg w-full">
          <div className="space-y-5">
            <input
              type="text"
              placeholder="Kraliçenin Adı"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="fairytale-input w-full px-5 py-4 rounded-sm font-cormorant text-base placeholder:text-[#b09a8a]/50"
            />
            <input
              type="email"
              placeholder="Kraliçenin E-postası"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="fairytale-input w-full px-5 py-4 rounded-sm font-cormorant text-base placeholder:text-[#b09a8a]/50"
            />
            <input
              type="password"
              placeholder="Sır Şifre (en az 8 karakter)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              className="fairytale-input w-full px-5 py-4 rounded-sm font-cormorant text-base placeholder:text-[#b09a8a]/50"
            />
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-sm text-center" style={{ background: "#c96b8b15", border: "1px solid #c96b8b30" }}>
              <p className="font-cormorant text-sm" style={{ color: "#a8507a" }}>✦ {error}</p>
            </div>
          )}

          <button
            onClick={handleCreate}
            disabled={loading}
            className="fairytale-btn w-full py-4 mt-6 rounded-sm font-cinzel text-xs tracking-[0.25em] uppercase font-semibold disabled:opacity-50"
          >
            {loading ? "✦ Hesap Oluşturuluyor..." : "✦ Kraliçe Hesabı Oluştur"}
          </button>
        </div>

        <p className="text-center mt-8 font-cormorant text-sm" style={{ color: "#8b7a6b" }}>
          <Link href="/admin/giris" className="hover:underline" style={{ color: "#c96b8b" }}>✦ Admin Girişi</Link>
        </p>
      </div>
    </main>
  );
}
