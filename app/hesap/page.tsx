"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthChange, updateUserSettings, logoutUser, type UserProfile } from "../lib/auth";
import { LilySmall } from "../components/Decorations";

const paintSplashBg = `
  radial-gradient(ellipse 500px 500px at 10% 15%, #FF5CA820 0%, transparent 70%),
  radial-gradient(ellipse 400px 400px at 85% 25%, #00F0FF18 0%, transparent 70%),
  linear-gradient(180deg, #0B0F2B 0%, #0d1130 50%, #080c20 100%)
`;

const themes: { value: string; label: string; desc: string; emoji: string; colors: string[] }[] = [
  { value: "karanlik", label: "Karanlık", desc: "Skull & Chain", emoji: "💀", colors: ["#0a0a0a", "#c0c0c0", "#808080", "#e63946"] },
  { value: "lacivert", label: "Lacivert", desc: "Ocean Depths", emoji: "🐙", colors: ["#0a1628", "#00b4d8", "#48cae4", "#90e0ef"] },
  { value: "yesil", label: "Yeşil", desc: "Nature", emoji: "🌿", colors: ["#0a1a12", "#52b788", "#74c69d", "#95d5b2"] },
  { value: "pembe", label: "Toz Pembe", desc: "Rose Garden", emoji: "🌸", colors: ["#2a1525", "#ff6b9d", "#ffc0cb", "#ff8fab"] },
  { value: "bej", label: "Bej", desc: "Mixed World", emoji: "🌍", colors: ["#2a2218", "#c9a96e", "#d4b896", "#e8d5a8"] },
];

export default function HesapPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", gender: "", theme: "karanlik" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const unsub = onAuthChange((u) => {
      if (!u) { router.push("/giris"); return; }
      setUser(u);
      setForm({ name: u.name || "", phone: u.phone || "", gender: u.gender || "", theme: u.theme || "karanlik" });
      if (u.theme) localStorage.setItem("semprexa_theme", u.theme);
      setLoading(false);
    });
    return () => { unsub.then((fn) => fn()); };
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    const result = await updateUserSettings(form);
    if (result.error) {
      alert("Hata: " + result.error);
    } else {
      setSaved(true);
      localStorage.setItem("semprexa_theme", form.theme);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
  };

  if (loading) {
    return (
      <main style={{ background: paintSplashBg, minHeight: "100vh" }} className="flex items-center justify-center">
        <div className="w-12 h-12 rounded-full animate-spin" style={{ border: "2px solid #BC6CFF30", borderTopColor: "#FF5CA8" }} />
      </main>
    );
  }

  return (
    <main style={{ background: paintSplashBg, minHeight: "100vh" }} className="pt-24 pb-16 px-4 md:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <LilySmall className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <h1 style={{ fontFamily: "var(--font-fuzzy)", fontSize: "2rem" }} className="neon-text-pink">Hesap Ayarları</h1>
          <div className="royal-divider mt-3"><span style={{ color: "#00F0FF" }}>✦</span></div>
        </div>

        {/* KULLANICI BILGILERI */}
        <div className="p-6 rounded-sm mb-6" style={{ background: "#111535", border: "1px solid #BC6CFF20" }}>
          <h2 style={{ fontFamily: "var(--font-fuzzy)", color: "#00F0FF", fontSize: "1.1rem" }} className="mb-4 neon-text-cyan">👤 Kişisel Bilgiler</h2>

          <div className="space-y-4">
            <div>
              <label style={{ fontFamily: "var(--font-cinzel)", color: "#BC6CFF80", fontSize: "9px", letterSpacing: "0.1em" }}>E-POSTA</label>
              <p style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", marginTop: "4px" }}>{user?.email}</p>
            </div>

            <div>
              <label style={{ fontFamily: "var(--font-cinzel)", color: "#BC6CFF80", fontSize: "9px", letterSpacing: "0.1em" }}>AD SOYAD</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100}
                className="w-full px-4 py-3 rounded-sm mt-1 outline-none" style={{ background: "#0d1130", border: "1px solid #BC6CFF30", color: "#E9CFE8", fontFamily: "var(--font-cormorant)", fontSize: "0.95rem" }} />
            </div>

            <div>
              <label style={{ fontFamily: "var(--font-cinzel)", color: "#BC6CFF80", fontSize: "9px", letterSpacing: "0.1em" }}>TELEFON</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={15}
                className="w-full px-4 py-3 rounded-sm mt-1 outline-none" style={{ background: "#0d1130", border: "1px solid #BC6CFF30", color: "#E9CFE8", fontFamily: "var(--font-cormorant)", fontSize: "0.95rem" }} />
            </div>

            <div>
              <label style={{ fontFamily: "var(--font-cinzel)", color: "#BC6CFF80", fontSize: "9px", letterSpacing: "0.1em" }}>CİNSİYET</label>
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full px-4 py-3 rounded-sm mt-1 outline-none" style={{ background: "#0d1130", border: "1px solid #BC6CFF30", color: form.gender ? "#E9CFE8" : "#BC6CFF80", fontFamily: "var(--font-cormorant)", fontSize: "0.95rem" }}>
                <option value="">Seçin</option>
                <option value="erkek">Erkek</option>
                <option value="kadin">Kadın</option>
              </select>
            </div>
          </div>
        </div>

        {/* TEMA SECIMI */}
        <div className="p-6 rounded-sm mb-6" style={{ background: "#111535", border: "1px solid #BC6CFF20" }}>
          <h2 style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8", fontSize: "1.1rem" }} className="mb-4 neon-text-pink">🎨 Tema Seçimi</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {themes.map(t => (
              <button key={t.value} onClick={() => setForm({ ...form, theme: t.value })} className="p-3 rounded-sm text-center transition-all hover:translate-y-[-2px]" style={{
                background: form.theme === t.value ? t.colors[0] + "ee" : "#0d1130",
                border: form.theme === t.value ? `2px solid ${t.colors[1]}60` : "1px solid #BC6CFF30",
                cursor: "pointer",
              }}>
                <span style={{ fontSize: "1.2rem" }}>{t.emoji}</span>
                <div className="flex justify-center gap-1 mt-1 mb-1">
                  {t.colors.map((c, i) => <div key={i} className="w-2 h-2 rounded-full" style={{ background: c, border: "1px solid #ffffff20" }} />)}
                </div>
                <p style={{ fontFamily: "var(--font-fuzzy)", color: form.theme === t.value ? t.colors[1] : "#E9CFE8", fontSize: "0.85rem" }}>{t.label}</p>
                <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF60", fontSize: "0.7rem", marginTop: "1px" }}>{t.desc}</p>
                {form.theme === t.value && <span className="mt-1 inline-block text-[10px]" style={{ color: t.colors[1] }}>✓ Aktif</span>}
              </button>
            ))}
          </div>
        </div>

        {/* KAYDET */}
        <div className="flex gap-3 mb-6">
          <button onClick={handleSave} disabled={saving} className="flex-1 py-4 rounded-sm transition-all hover:translate-y-[-1px]" style={{
            background: "linear-gradient(135deg, #FF5CA8, #BC6CFF)",
            color: "#fff", fontFamily: "var(--font-cinzel)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase",
            border: "1px solid #FF5CA860", boxShadow: "0 4px 20px #FF5CA830", cursor: saving ? "wait" : "pointer",
            opacity: saving ? 0.7 : 1,
          }}>
            {saving ? "Kaydediliyor..." : saved ? "✓ Kaydedildi!" : "✦ Kaydet ✦"}
          </button>
        </div>

        <div className="flex gap-3 mb-10">
          <Link href="/urunler" className="flex-1 py-3 rounded-sm text-center" style={{ border: "1px solid #BC6CFF40", color: "#BC6CFF", fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "0.15em" }}>
            Alışverişe Dön
          </Link>
          <button onClick={handleLogout} className="flex-1 py-3 rounded-sm" style={{ border: "1px solid #FF5CA840", color: "#FF5CA8", fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "0.15em", cursor: "pointer" }}>
            Çıkış Yap
          </button>
        </div>

        <div className="text-center">
          <LilySmall className="w-10 h-10 mx-auto opacity-20" />
        </div>
      </div>
    </main>
  );
}
