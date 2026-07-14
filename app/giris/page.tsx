"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { loginUser } from "../lib/auth";

export default function GirisPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) router.push("/ilanlar");
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

    router.push("/ilanlar");
  };

  return (
    <main className="min-h-screen bg-cream pt-24 pb-16 px-6">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-12">
          <span className="font-cinzel text-[10px] tracking-[0.5em] uppercase text-gold-dark/60 block mb-3">Hoş Geldiniz</span>
          <h1 className="font-playfair text-4xl font-bold text-coffee-dark">
            Hesabınıza <span className="text-gold">Giriş Yapın</span>
          </h1>
        </div>

        <div className="royal-frame p-8 bg-cream/80 space-y-6">
          <div className="space-y-4">
            <input type="email" placeholder="E-posta Adresiniz" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-5 py-4 bg-cream border border-gold/15 text-coffee-dark font-cormorant text-base placeholder:text-taupe/40 focus:outline-none focus:border-gold/40 transition-colors" />
            <input type="password" placeholder="Şifreniz" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} className="w-full px-5 py-4 bg-cream border border-gold/15 text-coffee-dark font-cormorant text-base placeholder:text-taupe/40 focus:outline-none focus:border-gold/40 transition-colors" />
          </div>

          {error && <p className="font-cormorant text-sm text-red-500 text-center">{error}</p>}

          <button onClick={handleLogin} disabled={loading} className="w-full py-4 bg-gold text-espresso font-cinzel text-xs tracking-[0.25em] uppercase font-semibold hover:bg-gold-light transition-all disabled:opacity-50">
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </div>

        <p className="text-center mt-8 font-cormorant text-sm text-taupe">
          Hesabınız yok mu? <Link href="/kayit" className="text-gold-dark hover:text-gold transition-colors">Kayıt Olun</Link>
        </p>
      </div>
    </main>
  );
}
