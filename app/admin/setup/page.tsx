"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "../../lib/auth";
import { LilySmall } from "../../components/Decorations";

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

    const { user, error: regError } = await registerUser(name, email, password, "", "");
    if (regError) { setError(regError); setLoading(false); return; }

    const res = await fetch("/api/db", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "updateUserRole", uid: user!.uid, role: "admin" }),
    });
    const json = await res.json();
    if (json.error) { setError(json.error); setLoading(false); return; }

    setDone(true);
    setLoading(false);
  };

  if (done) {
    return (
      <main className="admin-fairytale flex items-center justify-center min-h-screen px-6">
        <div className="relative z-10 text-center">
          <div className="fairytale-frame rounded-sm p-10">
            <h1 style={{ fontFamily: "var(--font-fuzzy)", fontSize: "1.8rem" }} className="neon-text-pink">Admin Hesabı Oluşturuldu!</h1>
            <p style={{ fontFamily: "var(--font-fuzzy)", color: "#BC6CFF" }} className="my-4">✦ Artık admin olarak giriş yapabilirsiniz ✦</p>
            <Link href="/admin/giris" className="fairytale-btn inline-block px-8 py-4 rounded-sm" style={{ fontFamily: "var(--font-cinzel)", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase" }}>Admin Girişi</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-fairytale flex items-center justify-center min-h-screen px-6">
      <div className="relative z-10 max-w-lg w-full">
        <div className="text-center mb-12">
          <LilySmall className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <h1 style={{ fontFamily: "var(--font-fuzzy)", fontSize: "2.5rem" }} className="neon-shimmer">Admin Hesabı Oluştur</h1>
          <p style={{ fontFamily: "var(--font-fuzzy)", color: "#BC6CFF" }} className="mt-2 neon-text-purple">✦ İlk kurulum ✦</p>
        </div>

        <div className="fairytale-frame p-8 space-y-5">
          <input type="text" placeholder="Adınız" value={name} onChange={(e) => setName(e.target.value)} className="fairytale-input w-full px-5 py-4 rounded-sm" style={{ fontFamily: "var(--font-fuzzy)" }} />
          <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} className="fairytale-input w-full px-5 py-4 rounded-sm" style={{ fontFamily: "var(--font-fuzzy)" }} />
          <input type="password" placeholder="Şifre (en az 8 karakter)" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleCreate()} className="fairytale-input w-full px-5 py-4 rounded-sm" style={{ fontFamily: "var(--font-fuzzy)" }} />

          {error && <p className="text-center text-sm neon-text-pink" style={{ fontFamily: "var(--font-fuzzy)" }}>✦ {error}</p>}

          <button onClick={handleCreate} disabled={loading} className="fairytale-btn w-full py-4 rounded-sm" style={{ fontFamily: "var(--font-cinzel)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase" }}>
            {loading ? "Oluşturuluyor..." : "✦ Admin Hesabı Oluştur"}
          </button>
        </div>

        <p className="text-center mt-8" style={{ fontFamily: "var(--font-fuzzy)", color: "#BC6CFF" }}>
          <Link href="/admin/giris" className="hover:underline neon-text-pink">Admin Girişi</Link>
        </p>
      </div>
    </main>
  );
}
