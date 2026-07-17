"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser, onAuthChange } from "../lib/auth";
import Captcha from "../components/Captcha";
import { LilySmall } from "../components/Decorations";

function sanitize(s: string): string {
  return s.replace(/[<>"'\/\\]/g, "").trim().slice(0, 100);
}

function sanitizePhone(s: string): string {
  return s.replace(/[<>"'\/\\]/g, "").trim().slice(0, 15);
}

function validateEmail(e: string): boolean {
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(e) && e.length <= 254;
}

function validatePhone(p: string): boolean {
  return /^\+?[0-9]{10,15}$/.test(p.replace(/[\s\-\(\)]/g, ""));
}

function checkPassword(p: string): { ok: boolean; msg: string } {
  if (p.length < 8) return { ok: false, msg: "En az 8 karakter" };
  if (p.length > 128) return { ok: false, msg: "En fazla 128 karakter" };
  if (!/[A-Z]/.test(p)) return { ok: false, msg: "En az bir büyük harf" };
  if (!/[a-z]/.test(p)) return { ok: false, msg: "En az bir küçük harf" };
  if (!/[0-9]/.test(p)) return { ok: false, msg: "En az bir rakam" };
  return { ok: true, msg: "" };
}

const paintSplashBg = `
  radial-gradient(ellipse 500px 500px at 10% 15%, #FF5CA825 0%, transparent 70%),
  radial-gradient(ellipse 400px 400px at 85% 25%, #00F0FF20 0%, transparent 70%),
  radial-gradient(ellipse 600px 350px at 45% 8%, #BC6CFF18 0%, transparent 70%),
  radial-gradient(ellipse 350px 500px at 25% 75%, #FFB86B15 0%, transparent 70%),
  radial-gradient(ellipse 450px 400px at 75% 70%, #FF5CA812 0%, transparent 70%),
  linear-gradient(180deg, #0B0F2B 0%, #0d1130 50%, #080c20 100%)
`;

export default function KayitPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", gender: "", theme: "karanlik" });
  const [captchaOk, setCaptchaOk] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  useEffect(() => {
    const unsub = onAuthChange((u) => { if (u) router.push("/urunler"); });
    return () => { unsub.then(fn => fn()); };
  }, [router]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name || form.name.length < 2) e.name = "Geçerli bir isim girin";
    if (!validateEmail(form.email)) e.email = "Geçerli bir e-posta girin";
    if (!validatePhone(form.phone)) e.phone = "Geçerli bir telefon girin";
    const pw = checkPassword(form.password);
    if (!pw.ok) e.password = pw.msg;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    if (!captchaOk) return alert("Robot dogrulamasini tamamlayin.");
    setLoading(true);
    const result = await registerUser(form.name, form.email, form.password, form.phone, form.gender, form.theme);
    if (result.error) { alert(result.error); setLoading(false); return; }
    localStorage.setItem("semprexa_theme", form.theme);
    setVerificationSent(true);
    setLoading(false);
  };

  const inputClass = (field: string) =>
    `fairytale-input w-full px-5 py-4 rounded-sm ${errors[field] ? "border-red-500!" : ""}`;

  if (verificationSent) {
    return (
      <main style={{ background: paintSplashBg, minHeight: "100vh" }} className="pt-24 pb-16 px-6">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-12">
            <LilySmall className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <h1 style={{ fontFamily: "var(--font-fuzzy)", fontSize: "2.5rem" }} className="neon-text-cyan">E-postanizi Kontrol Edin</h1>
            <div className="royal-divider mt-4"><span style={{ color: "#FF5CA8" }}>&#10022;</span></div>
          </div>
          <div className="fairytale-frame p-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center" style={{ background: "#00F0FF15", border: "2px solid #00F0FF30" }}>
              <span style={{ fontSize: "2rem" }}>&#9993;</span>
            </div>
            <p style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", fontSize: "1.1rem" }}>
              <strong>{form.email}</strong> adresine dogrulama linki gonderdik.
            </p>
            <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF" }}>
              E-posta kutunuzu (spam klasorunu de) kontrol edin ve dogrulama linkine tiklayin.
            </p>
            <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF80", fontSize: "0.85rem" }}>
              Dogrulama sonrasi <Link href="/giris" className="neon-text-pink hover:underline">Giris Yapin</Link> sayfasindan giris yapabilirsiniz.
            </p>
            <Link href="/giris" className="block w-full py-4 rounded-sm" style={{ background: "linear-gradient(135deg, #FF5CA8, #BC6CFF)", color: "#fff", fontFamily: "var(--font-cinzel)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase" }}>
              Giris Sayfasina Don
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: paintSplashBg, minHeight: "100vh" }} className="pt-24 pb-16 px-6">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-12">
          <LilySmall className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <h1 style={{ fontFamily: "var(--font-fuzzy)", fontSize: "2.5rem" }} className="neon-text-cyan">Hesap Olusturun</h1>
          <div className="royal-divider mt-4"><span style={{ color: "#FF5CA8" }}>&#10022;</span></div>
        </div>

        <div className="fairytale-frame p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <input type="text" placeholder="Adiniz Soyadiniz" value={form.name} onChange={(e) => setForm({ ...form, name: sanitize(e.target.value) })} maxLength={100} className={inputClass("name")} style={{ fontFamily: "var(--font-fuzzy)" }} />
              {errors.name && <span className="text-xs mt-1 block" style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8" }}>{errors.name}</span>}
            </div>
            <div>
              <input type="email" placeholder="E-posta Adresiniz" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value.toLowerCase().trim() })} maxLength={254} className={inputClass("email")} style={{ fontFamily: "var(--font-fuzzy)" }} />
              {errors.email && <span className="text-xs mt-1 block" style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8" }}>{errors.email}</span>}
            </div>
            <div>
              <input type="tel" placeholder="Telefon (+90 5XX XXX XX XX)" value={form.phone} onChange={(e) => setForm({ ...form, phone: sanitizePhone(e.target.value) })} maxLength={15} className={inputClass("phone")} style={{ fontFamily: "var(--font-fuzzy)" }} />
              {errors.phone && <span className="text-xs mt-1 block" style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8" }}>{errors.phone}</span>}
            </div>
            <div>
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="fairytale-input w-full px-5 py-4 rounded-sm" style={{ fontFamily: "var(--font-fuzzy)", color: form.gender ? "#E9CFE8" : "#BC6CFF80" }}>
                <option value="">Cinsiyet Seçin</option>
                <option value="erkek">Erkek</option>
                <option value="kadin">Kadın</option>
              </select>
            </div>
            <div>
              <label style={{ fontFamily: "var(--font-cinzel)", color: "#BC6CFF", fontSize: "10px", letterSpacing: "0.15em", display: "block", marginBottom: "8px" }}>TEMA SEÇİN</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { value: "karanlik", label: "Karanlık", emoji: "💀", colors: ["#0a0a0a", "#c0c0c0", "#808080"] },
                  { value: "lacivert", label: "Lacivert", emoji: "🐙", colors: ["#0a1628", "#00b4d8", "#48cae4"] },
                  { value: "yesil", label: "Yeşil", emoji: "🌿", colors: ["#0a1a12", "#52b788", "#74c69d"] },
                  { value: "pembe", label: "Pembe", emoji: "🌸", colors: ["#2a1525", "#ff6b9d", "#ffc0cb"] },
                  { value: "bej", label: "Bej", emoji: "🌍", colors: ["#2a2218", "#c9a96e", "#d4b896"] },
                ].map(t => (
                  <button key={t.value} type="button" onClick={() => setForm({ ...form, theme: t.value })} className="p-3 rounded-sm text-center transition-all" style={{
                    background: form.theme === t.value ? t.colors[0] + "ee" : "#0d1130",
                    border: form.theme === t.value ? `2px solid ${t.colors[1]}60` : "1px solid #BC6CFF30",
                    cursor: "pointer",
                  }}>
                    <span style={{ fontSize: "1.2rem" }}>{t.emoji}</span>
                    <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", color: form.theme === t.value ? t.colors[1] : "#BC6CFF", letterSpacing: "0.1em", marginTop: "4px" }}>{t.label}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <input type="password" placeholder="Sifre (8+ krk, buyuk+kucuk+rakam)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} maxLength={128} className={inputClass("password")} style={{ fontFamily: "var(--font-fuzzy)" }} />
              {errors.password && <span className="text-xs mt-1 block" style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8" }}>{errors.password}</span>}
              {form.password && !errors.password && <span className="text-xs mt-1 block neon-text-cyan">&#10003; Guclu sifre</span>}
            </div>
          </div>

          <Captcha onVerify={() => setCaptchaOk(true)} />

          <button onClick={handleRegister} disabled={loading} className="fairytale-btn w-full py-4 rounded-sm" style={{ fontFamily: "var(--font-cinzel)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase" }}>
            {loading ? "Kaydediliyor..." : "Kayit Ol"}
          </button>
        </div>

        <p className="text-center mt-8" style={{ fontFamily: "var(--font-fuzzy)", color: "#BC6CFF" }}>
          Hesabiniz var mi? <Link href="/giris" className="hover:underline neon-text-pink">Giris Yapin</Link>
        </p>
      </div>
    </main>
  );
}
