"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { registerUser } from "../lib/auth";
import Captcha from "../components/Captcha";
import { LilySmall } from "../components/Decorations";

function sanitize(s: string): string {
  return s.replace(/[<>"'\/\\]/g, "").trim().slice(0, 100);
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

export default function KayitPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [captchaOk, setCaptchaOk] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => { if (u) router.push("/urunler"); });
    return () => unsub();
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
    if (!captchaOk) return alert("Robot doğrulamasını tamamlayın.");
    setLoading(true);
    const { user, error } = await registerUser(form.name, form.email, form.password, form.phone);
    if (error) { alert(error); setLoading(false); return; }
    alert("Kayıt başarılı!");
    router.push("/urunler");
    setLoading(false);
  };

  const inputClass = (field: string) =>
    `fairytale-input w-full px-5 py-4 rounded-sm ${errors[field] ? "border-red-500!" : ""}`;

  return (
    <main style={{ background: "#191B37", minHeight: "100vh" }} className="pt-24 pb-16 px-6">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-12">
          <LilySmall className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <h1 style={{ fontFamily: "var(--font-yuyu)", fontSize: "2.5rem", color: "#E21C70" }}>Hesap Oluşturun</h1>
          <div className="royal-divider mt-4"><span style={{ color: "#7C4EBB" }}>✦</span></div>
        </div>

        <div className="fairytale-frame p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <input type="text" placeholder="Adınız Soyadınız" value={form.name} onChange={(e) => setForm({ ...form, name: sanitize(e.target.value) })} maxLength={100} className={inputClass("name")} style={{ fontFamily: "var(--font-fuzzy)" }} />
              {errors.name && <span className="text-xs mt-1 block" style={{ fontFamily: "var(--font-fuzzy)", color: "#AE0849" }}>{errors.name}</span>}
            </div>
            <div>
              <input type="email" placeholder="E-posta Adresiniz" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value.toLowerCase().trim() })} maxLength={254} className={inputClass("email")} style={{ fontFamily: "var(--font-fuzzy)" }} />
              {errors.email && <span className="text-xs mt-1 block" style={{ fontFamily: "var(--font-fuzzy)", color: "#AE0849" }}>{errors.email}</span>}
            </div>
            <div>
              <input type="tel" placeholder="Telefon (+90 5XX XXX XX XX)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={15} className={inputClass("phone")} style={{ fontFamily: "var(--font-fuzzy)" }} />
              {errors.phone && <span className="text-xs mt-1 block" style={{ fontFamily: "var(--font-fuzzy)", color: "#AE0849" }}>{errors.phone}</span>}
            </div>
            <div>
              <input type="password" placeholder="Şifre (8+ krk, büyük+küçük+rakam)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} maxLength={128} className={inputClass("password")} style={{ fontFamily: "var(--font-fuzzy)" }} />
              {errors.password && <span className="text-xs mt-1 block" style={{ fontFamily: "var(--font-fuzzy)", color: "#AE0849" }}>{errors.password}</span>}
              {form.password && !errors.password && <span className="text-xs mt-1 block" style={{ fontFamily: "var(--font-fuzzy)", color: "#7C4EBB" }}>✓ Güçlü şifre</span>}
            </div>
          </div>

          <Captcha onVerify={() => setCaptchaOk(true)} />

          <button onClick={handleRegister} disabled={loading} className="fairytale-btn w-full py-4 rounded-sm" style={{ fontFamily: "var(--font-cinzel)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase" }}>
            {loading ? "Kaydediliyor..." : "✦ Kayıt Ol"}
          </button>
        </div>

        <p className="text-center mt-8" style={{ fontFamily: "var(--font-fuzzy)", color: "#872D72" }}>
          Hesabınız var mı? <Link href="/giris" className="hover:underline" style={{ color: "#E21C70" }}>Giriş Yapın</Link>
        </p>
      </div>
    </main>
  );
}
