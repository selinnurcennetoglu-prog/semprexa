"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { loginUser } from "../../lib/auth";
import { doc, getDoc } from "firebase/firestore";

function VineSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M60 0 C60 40, 20 60, 30 100 S80 140, 60 180 S20 220, 40 260 S80 300, 60 340 S30 370, 60 400" stroke="#6b8f5e" strokeWidth="2" opacity="0.3" fill="none"/>
      <path d="M30 100 C20 95, 10 80, 5 70 M30 100 C20 105, 10 110, 5 120" stroke="#6b8f5e" strokeWidth="1.5" opacity="0.25" fill="none"/>
      <path d="M60 180 C50 175, 40 160, 35 150 M60 180 C70 175, 80 185, 90 195" stroke="#6b8f5e" strokeWidth="1.5" opacity="0.25" fill="none"/>
      <path d="M40 260 C30 255, 20 240, 15 230 M40 260 C50 265, 60 270, 70 280" stroke="#6b8f5e" strokeWidth="1.5" opacity="0.25" fill="none"/>
      <ellipse cx="5" cy="70" rx="8" ry="5" fill="#6b8f5e" opacity="0.12" transform="rotate(-30 5 70)"/>
      <ellipse cx="90" cy="195" rx="8" ry="5" fill="#6b8f5e" opacity="0.12" transform="rotate(20 90 195)"/>
      <ellipse cx="15" cy="230" rx="8" ry="5" fill="#6b8f5e" opacity="0.12" transform="rotate(-25 15 230)"/>
    </svg>
  );
}

function LeafSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 5 C25 10, 35 15, 35 25 C35 32, 28 37, 20 37 C12 37, 5 32, 5 25 C5 15, 15 10, 20 5Z" fill="#6b8f5e" opacity="0.15"/>
      <path d="M20 5 L20 37" stroke="#6b8f5e" strokeWidth="0.5" opacity="0.2"/>
      <path d="M20 12 L12 20 M20 18 L28 24 M20 25 L14 30" stroke="#6b8f5e" strokeWidth="0.3" opacity="0.15"/>
    </svg>
  );
}

function Sparkles() {
  const dots = Array.from({ length: 15 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    size: `${3 + Math.random() * 4}px`,
  }));
  return (
    <>
      {dots.map((d, i) => (
        <div
          key={i}
          className="sparkle-dot"
          style={{ left: d.left, top: d.top, animationDelay: d.delay, width: d.size, height: d.size }}
        />
      ))}
    </>
  );
}

export default function AdminGirisPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const snap = await getDoc(doc(db, "users", u.uid));
        if (snap.exists() && snap.data().role === "admin") {
          router.push("/admin");
        }
      }
    });
    return () => unsub();
  }, [router]);

  const handleLogin = async () => {
    setError("");
    if (!email || !password) return setError("Tüm alanları doldurun.");
    setLoading(true);

    const { user, error: err } = await loginUser(email, password);
    if (err) {
      setError(err);
      setLoading(false);
      return;
    }

    if (!user || user.role !== "admin") {
      setError("Bu alan sadece yöneticilere açıktır.");
      setLoading(false);
      return;
    }

    router.push("/admin");
  };

  return (
    <main className="admin-fairytale relative">
      <Sparkles />

      <div className="vine-decoration left-4 top-0 w-16 h-80 opacity-40 hidden lg:block">
        <VineSVG className="w-full h-full" />
      </div>
      <div className="vine-decoration right-4 top-20 w-16 h-80 opacity-30 hidden lg:block" style={{ animationDelay: "1.5s" }}>
        <VineSVG className="w-full h-full transform scale-x-[-1]" />
      </div>
      <div className="leaf-decoration left-20 top-32 w-10 h-10 hidden lg:block" style={{ animationDelay: "0.5s" }}>
        <LeafSVG className="w-full h-full" />
      </div>
      <div className="leaf-decoration right-32 top-16 w-8 h-8 hidden lg:block" style={{ animationDelay: "2s" }}>
        <LeafSVG className="w-full h-full transform rotate-45" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <LeafSVG className="w-8 h-8 opacity-50" />
            <span className="font-cinzel text-[10px] tracking-[0.5em] uppercase" style={{ color: "#c96b8b" }}>
              Perilerin Kapısı
            </span>
            <LeafSVG className="w-8 h-8 opacity-50 transform scale-x-[-1]" />
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold" style={{ color: "#5a2a3a" }}>
            Yönetici <span style={{ color: "#c96b8b" }}>Girişi</span>
          </h1>
          <div className="royal-divider mt-4">
            <span className="font-cormorant text-sm" style={{ color: "#8b7a6b" }}>✦</span>
          </div>
        </div>

        <div className="fairytale-frame rounded-sm p-8 md:p-10 bg-gradient-to-br from-[#faf5ee] to-[#f0e0d0] max-w-lg w-full">
          <div className="space-y-5">
            <input
              type="email"
              placeholder="Yönetici E-postası"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="fairytale-input w-full px-5 py-4 rounded-sm font-cormorant text-base placeholder:text-[#b09a8a]/50"
            />
            <input
              type="password"
              placeholder="Yönetici Şifresi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="fairytale-input w-full px-5 py-4 rounded-sm font-cormorant text-base placeholder:text-[#b09a8a]/50"
            />
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-sm text-center" style={{ background: "#c96b8b15", border: "1px solid #c96b8b30" }}>
              <p className="font-cormorant text-sm" style={{ color: "#a8507a" }}>{error}</p>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="fairytale-btn w-full py-4 mt-6 rounded-sm font-cinzel text-xs tracking-[0.25em] uppercase font-semibold disabled:opacity-50"
          >
            {loading ? "✦ Giriş yapılıyor..." : "✦ Yönetici Girişi"}
          </button>
        </div>

        <p className="text-center mt-8 font-cormorant text-sm" style={{ color: "#8b7a6b" }}>
          <Link href="/giris" className="hover:underline" style={{ color: "#c96b8b" }}>Normal Girişe Dön</Link>
        </p>
      </div>
    </main>
  );
}
