"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { loginUser } from "../../lib/auth";
import { doc, getDoc } from "firebase/firestore";
import { LilySmall } from "../../components/Decorations";

export default function AdminGirisPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) { const snap = await getDoc(doc(db, "users", u.uid)); if (snap.exists() && snap.data().role === "admin") router.push("/admin"); }
    });
    return () => unsub();
  }, [router]);

  const handleLogin = async () => {
    setError("");
    if (!email || !password) return setError("Tüm alanları doldurun.");
    setLoading(true);
    const { user, error: err } = await loginUser(email, password);
    if (err) { setError(err); setLoading(false); return; }
    if (!user || user.role !== "admin") { setError("Bu alan sadece yöneticilere açıktır."); setLoading(false); return; }
    router.push("/admin");
  };

  return (
    <main className="admin-fairytale relative flex items-center justify-center min-h-screen px-6">
      <div className="relative z-10 max-w-lg w-full">
        <div className="text-center mb-12">
          <LilySmall className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <h1 style={{ fontFamily: "var(--font-yuyu)", fontSize: "2.5rem", color: "#E21C70" }}>Yönetici Girişi</h1>
          <div className="royal-divider mt-4"><span style={{ color: "#7C4EBB" }}>✦</span></div>
        </div>

        <div className="fairytale-frame p-8 space-y-6">
          <input type="email" placeholder="Admin E-posta" value={email} onChange={(e) => setEmail(e.target.value)} className="fairytale-input w-full px-5 py-4 rounded-sm" style={{ fontFamily: "var(--font-fuzzy)" }} />
          <input type="password" placeholder="Admin Şifresi" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} className="fairytale-input w-full px-5 py-4 rounded-sm" style={{ fontFamily: "var(--font-fuzzy)" }} />

          {error && <p className="text-center text-sm" style={{ fontFamily: "var(--font-fuzzy)", color: "#AE0849" }}>{error}</p>}

          <button onClick={handleLogin} disabled={loading} className="fairytale-btn w-full py-4 rounded-sm" style={{ fontFamily: "var(--font-cinzel)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase" }}>
            {loading ? "Giriş yapılıyor..." : "✦ Yönetici Girişi"}
          </button>
        </div>

        <p className="text-center mt-8" style={{ fontFamily: "var(--font-fuzzy)", color: "#872D72" }}>
          <Link href="/giris" className="hover:underline" style={{ color: "#E21C70" }}>Normal Girişe Dön</Link>
        </p>
      </div>
    </main>
  );
}
