"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { registerUser } from "../lib/auth";
import Captcha from "../components/Captcha";

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
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) router.push("/ilanlar");
    });
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
    if (error) {
      alert(error);
      setLoading(false);
      return;
    }

    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: form.email,
          subject: "Hoş Geldiniz - Semprexa",
          html: `<h2>Hoş geldiniz, ${form.name}!</h2><p>Semprexa hesabınız başarıyla oluşturuldu.</p><p>Finans dünyasına hoş geldiniz.</p>`,
        }),
      });
    } catch {}

    alert("Kayıt başarılı!");
    router.push("/ilanlar");
    setLoading(false);
  };

  const inputClass = (field: string) =>
    `w-full px-5 py-4 bg-cream border text-coffee-dark font-cormorant text-base placeholder:text-taupe/40 focus:outline-none transition-colors ${
      errors[field] ? "border-red-400 focus:border-red-500" : "border-gold/15 focus:border-gold/40"
    }`;

  return (
    <main className="min-h-screen bg-cream pt-24 pb-16 px-6">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-12">
          <span className="font-cinzel text-[10px] tracking-[0.5em] uppercase text-gold-dark/60 block mb-3">
            Kraliyet Davetiyesi
          </span>
          <h1 className="font-playfair text-4xl font-bold text-coffee-dark">
            Hesap <span className="text-gold">Oluşturun</span>
          </h1>
        </div>

        <div className="royal-frame p-8 bg-cream/80 space-y-6">
          <div className="space-y-4">
            <div>
              <input type="text" placeholder="Adınız Soyadınız" value={form.name} onChange={(e) => setForm({ ...form, name: sanitize(e.target.value) })} maxLength={100} className={inputClass("name")} />
              {errors.name && <span className="font-cormorant text-xs text-red-500 mt-1 block">{errors.name}</span>}
            </div>
            <div>
              <input type="email" placeholder="E-posta Adresiniz" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value.toLowerCase().trim() })} maxLength={254} className={inputClass("email")} />
              {errors.email && <span className="font-cormorant text-xs text-red-500 mt-1 block">{errors.email}</span>}
            </div>
            <div>
              <input type="tel" placeholder="Telefon (+90 5XX XXX XX XX)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={15} className={inputClass("phone")} />
              {errors.phone && <span className="font-cormorant text-xs text-red-500 mt-1 block">{errors.phone}</span>}
            </div>
            <div>
              <input type="password" placeholder="Şifre (8+ krk, büyük+küçük+rakam)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} maxLength={128} className={inputClass("password")} />
              {errors.password && <span className="font-cormorant text-xs text-red-500 mt-1 block">{errors.password}</span>}
              {form.password && !errors.password && <span className="font-cormorant text-xs text-gold-dark mt-1 block">✓ Güçlü şifre</span>}
            </div>
          </div>

          <div className="p-4 bg-royal/5 border border-gold/10">
            <p className="font-cormorant text-[11px] text-taupe/60">
              <strong className="text-taupe">Gereksinimler:</strong> 8+ karakter, büyük harf, küçük harf, rakam.
            </p>
          </div>

          <Captcha onVerify={() => setCaptchaOk(true)} />

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full py-4 bg-gold text-espresso font-cinzel text-xs tracking-[0.25em] uppercase font-semibold hover:bg-gold-light transition-all disabled:opacity-50"
          >
            {loading ? "Kaydediliyor..." : "Kayıt Ol"}
          </button>
        </div>

        <p className="text-center mt-8 font-cormorant text-sm text-taupe">
          Hesabınız var mı? <Link href="/giris" className="text-gold-dark hover:text-gold transition-colors">Giriş Yapın</Link>
        </p>
      </div>
    </main>
  );
}
