"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { loginUser } from "../lib/auth";
import { LilySmall } from "../components/Decorations";

export default function GirisPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => { if (u) router.push("/urunler"); });
    return () => unsub();
  }, [router]);

  const handleLogin = async () => {
    setError("");
    if (!email || !password) return setError("Tüm alanları doldurun.");
    setLoading(true);
    const { user, error: err } = await loginUser(email, password);
    if (err) { setError(err); setLoading(false); return; }
    router.push("/urunler");
  };

  return (
    <main style={{ background: "#191B37", minHeight: "100vh" }} className="pt-24 pb-16 px-6">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-12">
          <LilySmall className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <h1 style={{ fontFamily: "var(--font-yuyu)", fontSize: "2.5rem", color: "#E21C70" }}>Giriş Yapın</h1>
          <div className="royal-divider mt-4"><span style={{ color: "#7C4EBB" }}>✦</span></div>
        </div>

        <div className="fairytale-frame p-8 space-y-6">
          <input type="email" placeholder="E-posta Adresiniz" value={email} onChange={(e) => setEmail(e.target.value)} className="fairytale-input w-full px-5 py-4 rounded-sm" style={{ fontFamily: "var(--font-fuzzy)" }} />
          <input type="password" placeholder="Şifreniz" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} className="fairytale-input w-full px-5 py-4 rounded-sm" style={{ fontFamily: "var(--font-fuzzy)" }} />

          {error && <p className="text-center text-sm" style={{ fontFamily: "var(--font-fuzzy)", color: "#AE0849" }}>{error}</p>}

          <button onClick={handleLogin} disabled={loading} className="fairytale-btn w-full py-4 rounded-sm" style={{ fontFamily: "var(--font-cinzel)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase" }}>
            {loading ? "Giriş yapılıyor..." : "✦ Giriş Yap"}
          </button>
        </div>

        <p className="text-center mt-8" style={{ fontFamily: "var(--font-fuzzy)", color: "#872D72" }}>
          Hesabınız yok mu? <Link href="/kayit" className="hover:underline" style={{ color: "#E21C70" }}>Kayıt Olun</Link>
        </p>
      </div>
    </main>
  );
}
