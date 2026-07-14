"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { loginUser } from "../../lib/auth";
import { doc, getDoc } from "firebase/firestore";

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
    <main className="min-h-screen bg-cream pt-24 pb-16 px-6">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-12">
          <span className="font-cinzel text-[10px] tracking-[0.5em] uppercase text-gold-dark/60 block mb-3">Yönetim Paneli</span>
          <h1 className="font-playfair text-4xl font-bold text-coffee-dark">
            Admin <span className="text-gold">Girişi</span>
          </h1>
        </div>

        <div className="royal-frame p-8 bg-cream/80 space-y-6">
          <div className="space-y-4">
            <input type="email" placeholder="Admin E-posta" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-5 py-4 bg-cream border border-gold/15 text-coffee-dark font-cormorant text-base placeholder:text-taupe/40 focus:outline-none focus:border-gold/40 transition-colors" />
            <input type="password" placeholder="Admin Şifresi" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} className="w-full px-5 py-4 bg-cream border border-gold/15 text-coffee-dark font-cormorant text-base placeholder:text-taupe/40 focus:outline-none focus:border-gold/40 transition-colors" />
          </div>

          {error && <p className="font-cormorant text-sm text-red-500 text-center">{error}</p>}

          <button onClick={handleLogin} disabled={loading} className="w-full py-4 bg-gold text-espresso font-cinzel text-xs tracking-[0.25em] uppercase font-semibold hover:bg-gold-light transition-all disabled:opacity-50">
            {loading ? "Giriş yapılıyor..." : "Yönetici Girişi"}
          </button>
        </div>

        <p className="text-center mt-8 font-cormorant text-sm text-taupe">
          <Link href="/giris" className="text-gold-dark hover:text-gold transition-colors">Normal Girişe Dön</Link>
        </p>
      </div>
    </main>
  );
}
