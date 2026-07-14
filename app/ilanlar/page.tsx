"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getListings, type Listing } from "../lib/db";

export default function IlanlarPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Tümü");
  const [loading, setLoading] = useState(true);

  const types = ["Tümü", "Şirket Ortaklığı", "Hisse Alımı", "Hisse Satımı", "Şirket Satışı", "Şirket Alımı", "Yatırım Ortaklığı"];

  useEffect(() => {
    setLoading(true);
    getListings({ type: typeFilter, search }).then((data) => {
      setListings(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [typeFilter, search]);

  const typeColors: Record<string, string> = {
    "Şirket Ortaklığı": "bg-gold/15 text-gold",
    "Hisse Alımı": "bg-emerald-900/30 text-emerald-400",
    "Hisse Satımı": "bg-red-900/30 text-red-400",
    "Şirket Satışı": "bg-blue-900/30 text-blue-400",
    "Şirket Alımı": "bg-purple-900/30 text-purple-400",
    "Yatırım Ortaklığı": "bg-amber-900/30 text-amber-400",
  };

  return (
    <main className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="font-cinzel text-[10px] tracking-[0.5em] uppercase text-gold-dark/60 block mb-3">Finans Piyasası</span>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-coffee-dark mb-4">
            Güncel <span className="text-gold">İlanlar</span>
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <input type="text" placeholder="Şirket veya ilan ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 px-5 py-3 bg-cream border border-gold/15 text-coffee-dark font-cormorant placeholder:text-taupe/40 focus:outline-none focus:border-gold/40 transition-colors" />
          <div className="flex flex-wrap gap-2">
            {types.map((t) => (
              <button key={t} onClick={() => setTypeFilter(t)} className={`px-4 py-2 font-cormorant text-xs tracking-widest uppercase transition-all ${typeFilter === t ? "bg-gold text-espresso" : "border border-gold/20 text-taupe hover:border-gold/40 hover:text-gold-dark"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20"><span className="text-gold text-3xl animate-pulse">♛</span><p className="font-cormorant text-taupe mt-4">Yükleniyor...</p></div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20"><span className="text-gold text-3xl">♛</span><p className="font-cormorant text-taupe mt-4">İlan bulunamadı.</p><Link href="/ilan/yeni" className="mt-4 inline-block px-8 py-3 bg-gold text-espresso font-cinzel text-xs tracking-widest uppercase font-semibold hover:bg-gold-light transition-all">İlan Oluştur</Link></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((l) => (
              <Link key={l.id} href={`/ilan/${l.id}`}>
                <div className="royal-frame p-6 bg-cream/50 hover:bg-cream transition-all duration-500 cursor-pointer group h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <span className={`px-3 py-1 text-[10px] tracking-widest uppercase font-cinzel ${typeColors[l.type] || "bg-gold/10 text-gold"}`}>{l.type}</span>
                    {l.aiApproved && <span className="text-[10px] text-gold/50 font-cormorant flex items-center gap-1"><span className="w-1.5 h-1.5 bg-gold/60 rounded-full" />Rexai Onaylı</span>}
                  </div>
                  <h3 className="font-playfair text-lg font-semibold text-coffee-dark group-hover:text-gold-dark transition-colors mb-2">{l.title}</h3>
                  <p className="font-cormorant text-sm text-taupe line-clamp-2 mb-4 flex-1">{l.desc}</p>
                  <div className="border-t border-gold/10 pt-4 space-y-2">
                    <div className="flex justify-between font-cormorant text-xs text-taupe"><span>Şirket: <strong className="text-coffee-dark">{l.company}</strong></span><span>Ciro: <strong className="text-coffee-dark">{l.ciro}</strong></span></div>
                    <div className="flex justify-between font-cormorant text-xs"><span className="text-taupe">{l.date}</span><span className="text-gold-dark font-semibold">{l.price}</span></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
