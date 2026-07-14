"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { createListing } from "../../lib/db";

export default function YeniIlanPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ uid: string; name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", type: "Şirket Ortaklığı", company: "", ciro: "", price: "", phone: "", desc: "" });

  const types = ["Şirket Ortaklığı", "Hisse Alımı", "Hisse Satımı", "Şirket Satışı", "Şirket Alımı", "Yatırım Ortaklığı"];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) setUser({ uid: u.uid, name: u.displayName || "", email: u.email || "" });
      else router.push("/giris");
    });
    return () => unsub();
  }, [router]);

  const handleSubmit = async () => {
    if (!user) return;
    if (!form.title || !form.company || !form.phone || !form.desc) return alert("Zorunlu alanları doldurun.");
    setLoading(true);

    try {
      await createListing({
        ...form,
        ownerUid: user.uid,
        ownerName: user.name,
        ownerEmail: user.email,
      } as never);
      alert("İlanınız yayınlandı!");
      router.push("/ilanlar");
    } catch (err) {
      alert("Hata oluştu: " + (err instanceof Error ? err.message : "Bilinmeyen hata"));
    }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-cream pt-24 pb-16 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <span className="font-cinzel text-[10px] tracking-[0.5em] uppercase text-gold-dark/60 block mb-3">Yeni İlan</span>
          <h1 className="font-playfair text-4xl font-bold text-coffee-dark">İlan <span className="text-gold">Oluşturun</span></h1>
        </div>

        <div className="royal-frame p-8 bg-cream/80 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="font-cormorant text-xs text-taupe uppercase tracking-widest mb-1 block">İlan Başlığı *</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Örn: THYAO Hisse Paketi Satışı" className="w-full px-5 py-4 bg-cream border border-gold/15 text-coffee-dark font-cormorant placeholder:text-taupe/40 focus:outline-none focus:border-gold/40 transition-colors" />
            </div>
            <div>
              <label className="font-cormorant text-xs text-taupe uppercase tracking-widest mb-1 block">İlan Türü *</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-5 py-4 bg-cream border border-gold/15 text-coffee-dark font-cormorant focus:outline-none focus:border-gold/40 transition-colors">
                {types.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="font-cormorant text-xs text-taupe uppercase tracking-widest mb-1 block">Şirket Adı *</label>
              <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Şirket adı" className="w-full px-5 py-4 bg-cream border border-gold/15 text-coffee-dark font-cormorant placeholder:text-taupe/40 focus:outline-none focus:border-gold/40 transition-colors" />
            </div>
            <div>
              <label className="font-cormorant text-xs text-taupe uppercase tracking-widest mb-1 block">Yıllık Ciro</label>
              <input type="text" value={form.ciro} onChange={(e) => setForm({ ...form, ciro: e.target.value })} placeholder="Örn: ₺45M" className="w-full px-5 py-4 bg-cream border border-gold/15 text-coffee-dark font-cormorant placeholder:text-taupe/40 focus:outline-none focus:border-gold/40 transition-colors" />
            </div>
            <div>
              <label className="font-cormorant text-xs text-taupe uppercase tracking-widest mb-1 block">Fiyat / Değer *</label>
              <input type="text" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Örn: ₺2.5M" className="w-full px-5 py-4 bg-cream border border-gold/15 text-coffee-dark font-cormorant placeholder:text-taupe/40 focus:outline-none focus:border-gold/40 transition-colors" />
            </div>
            <div>
              <label className="font-cormorant text-xs text-taupe uppercase tracking-widest mb-1 block">Telefon *</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+90 5XX XXX XX XX" className="w-full px-5 py-4 bg-cream border border-gold/15 text-coffee-dark font-cormorant placeholder:text-taupe/40 focus:outline-none focus:border-gold/40 transition-colors" />
            </div>
            <div className="md:col-span-2">
              <label className="font-cormorant text-xs text-taupe uppercase tracking-widest mb-1 block">Açıklama *</label>
              <textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} placeholder="İlanınız hakkında detaylı bilgi..." rows={5} className="w-full px-5 py-4 bg-cream border border-gold/15 text-coffee-dark font-cormorant placeholder:text-taupe/40 focus:outline-none focus:border-gold/40 transition-colors resize-none" />
            </div>
          </div>

          <button onClick={handleSubmit} disabled={loading} className="w-full py-4 bg-gold text-espresso font-cinzel text-xs tracking-[0.25em] uppercase font-semibold hover:bg-gold-light transition-all disabled:opacity-50">
            {loading ? "Yayınlanıyor..." : "İlanı Yayınla"}
          </button>
        </div>
      </div>
    </main>
  );
}
