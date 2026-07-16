"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser, onAuthChange } from "../lib/auth";
import { LilySmall } from "../components/Decorations";

const paintSplashBg = `
  radial-gradient(ellipse 500px 500px at 8% 20%, #FF5CA825 0%, transparent 70%),
  radial-gradient(ellipse 400px 400px at 90% 30%, #00F0FF20 0%, transparent 70%),
  radial-gradient(ellipse 600px 350px at 50% 5%, #BC6CFF18 0%, transparent 70%),
  radial-gradient(ellipse 350px 500px at 20% 80%, #FFB86B15 0%, transparent 70%),
  radial-gradient(ellipse 450px 400px at 80% 75%, #FF5CA812 0%, transparent 70%),
  linear-gradient(180deg, #0B0F2B 0%, #0d1130 50%, #080c20 100%)
`;

export default function GirisPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const unsub = onAuthChange((u) => { if (u) router.push("/urunler"); });
    return () => { unsub.then(fn => fn()); };
  }, [router]);

  const handleLogin = async () => {
    setError("");
    setInfo("");
    if (!email || !password) return setError("Tum alanlari doldurun.");

    if (attempts >= 5) {
      setError("Cok fazla basarisiz deneme. 5 dakika bekleyin.");
      return;
    }

    setLoading(true);
    const { user, error: err } = await loginUser(email, password);
    if (err) {
      setError(err);
      setAttempts((a) => a + 1);
      setLoading(false);
      return;
    }
    if (user) router.push("/urunler");
    setLoading(false);
  };

  return (
    <main style={{ background: paintSplashBg, minHeight: "100vh" }} className="pt-24 pb-16 px-6">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-12">
          <LilySmall className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <h1 style={{ fontFamily: "var(--font-fuzzy)", fontSize: "2.5rem" }} className="neon-text-pink">Giris Yapin</h1>
          <div className="royal-divider mt-4"><span style={{ color: "#00F0FF" }}>&#10022;</span></div>
        </div>

        <div className="fairytale-frame p-8 space-y-6">
          <input type="email" placeholder="E-posta Adresiniz" value={email} onChange={(e) => setEmail(e.target.value)} className="fairytale-input w-full px-5 py-4 rounded-sm" style={{ fontFamily: "var(--font-fuzzy)" }} />
          <input type="password" placeholder="Sifreniz" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} className="fairytale-input w-full px-5 py-4 rounded-sm" style={{ fontFamily: "var(--font-fuzzy)" }} />

          {error && <p className="text-center text-sm p-3 rounded-sm" style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8", background: "#FF5CA815" }}>{error}</p>}

          {info && <p className="text-center text-sm p-3 rounded-sm" style={{ fontFamily: "var(--font-fuzzy)", color: "#00F0FF", background: "#00F0FF15" }}>{info}</p>}

          {attempts > 0 && attempts < 5 && (
            <p className="text-center text-xs" style={{ fontFamily: "var(--font-cormorant)", color: "#FFB86B" }}>
              Kalan deneme: {5 - attempts}
            </p>
          )}

          <button onClick={handleLogin} disabled={loading || attempts >= 5} className="fairytale-btn w-full py-4 rounded-sm" style={{ fontFamily: "var(--font-cinzel)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", opacity: loading || attempts >= 5 ? 0.5 : 1, cursor: loading || attempts >= 5 ? "not-allowed" : "pointer" }}>
            {loading ? "Giris yapiliyor..." : "Giris Yap"}
          </button>
        </div>

        <p className="text-center mt-8" style={{ fontFamily: "var(--font-fuzzy)", color: "#BC6CFF" }}>
          Hesabiniz yok mu? <Link href="/kayit" className="hover:underline neon-text-pink">Kayit Olun</Link>
        </p>
      </div>
    </main>
  );
}
