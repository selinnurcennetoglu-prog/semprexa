"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getProducts, type Product } from "../lib/db";
import { LilySmall } from "../components/Decorations";
import { useTheme } from "../lib/useTheme";

export default function DashboardPage() {
  const { bg } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getProducts().then((p) => { setProducts(p); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const categories = ["Tümü", ...Array.from(new Set(products.map(p => p.category)))];

  const filtered = products.filter(p => {
    const matchCategory = selectedCategory === "Tümü" || p.category === selectedCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <main style={{ background: bg, minHeight: "100vh" }} className="pt-20 pb-16">
      {/* HERO */}
      <div className="relative overflow-hidden py-16 px-6" style={{ background: "linear-gradient(180deg, #111535 0%, transparent 100%)" }}>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "0.5em", textTransform: "uppercase", color: "#00F0FF" }} className="block mb-4 neon-text-cyan">✦ Semprexa ✦</span>
          <h1 style={{ fontFamily: "var(--font-fuzzy)", fontSize: "3rem" }} className="neon-shimmer mb-4">Koleksiyonumuz</h1>
          <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF", fontSize: "1.1rem", maxWidth: "500px", margin: "0 auto" }}>
            Özenle seçilmiş ürünlerimizi keşfedin
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* SEARCH */}
        <div className="mb-8">
          <div className="relative">
            <input type="text" placeholder="Ürün ara..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full px-6 py-4 rounded-sm outline-none pr-12"
              style={{ background: "#111535", border: "1px solid #BC6CFF25", color: "#E9CFE8", fontFamily: "var(--font-cormorant)", fontSize: "1rem" }} />
            <span className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: "#BC6CFF60", fontSize: "1.2rem" }}>🔍</span>
          </div>
        </div>

        {/* CATEGORIES */}
        <div className="flex gap-2 flex-wrap mb-10 justify-center">
          {categories.map(c => (
            <button key={c} onClick={() => setSelectedCategory(c)} className="px-5 py-2.5 rounded-sm text-xs tracking-wider uppercase transition-all"
              style={{
                fontFamily: "var(--font-cinzel)",
                background: selectedCategory === c ? "linear-gradient(135deg, #FF5CA8, #BC6CFF)" : "#111535",
                color: selectedCategory === c ? "#fff" : "#E9CFE8",
                border: `1px solid ${selectedCategory === c ? "#FF5CA860" : "#BC6CFF25"}`,
                boxShadow: selectedCategory === c ? "0 4px 15px #FF5CA830" : "none",
              }}>
              {c}
            </button>
          ))}
        </div>

        {/* STATS BAR */}
        <div className="flex items-center justify-between mb-6 px-1">
          <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF80", fontSize: "0.9rem" }}>
            {filtered.length} ürün bulundu
          </p>
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-sm" style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", background: "#FF5CA815", color: "#FF5CA8", letterSpacing: "0.05em" }}>
              {products.length} Toplam Ürün
            </span>
            <span className="px-3 py-1 rounded-sm" style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", background: "#00F0FF15", color: "#00F0FF", letterSpacing: "0.05em" }}>
              {products.filter(p => p.stock > 0).length} Stokta
            </span>
          </div>
        </div>

        {/* PRODUCTS GRID */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 rounded-full animate-spin mx-auto mb-4" style={{ border: "2px solid #BC6CFF30", borderTopColor: "#FF5CA8" }} />
            <p style={{ fontFamily: "var(--font-fuzzy)", color: "#BC6CFF" }}>Yükleniyor...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <LilySmall className="w-20 h-20 mx-auto mb-4 opacity-30" />
            <p style={{ fontFamily: "var(--font-fuzzy)", color: "#BC6CFF", fontSize: "1.2rem" }}>Ürün bulunamadı</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((p) => (
              <Link key={p.id} href={`/urun/${p.id}`} className="product-card rounded-sm overflow-hidden group" style={{ transition: "transform 0.3s, box-shadow 0.3s" }}>
                <div className="h-60 flex items-center justify-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, #111535, #1a1040)" }}>
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <LilySmall className="w-20 h-20 opacity-20 group-hover:opacity-40 transition-opacity" />
                  )}
                  {p.stock <= 0 && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: "#00000080" }}>
                      <span style={{ fontFamily: "var(--font-cinzel)", color: "#FF5CA8", fontSize: "12px", letterSpacing: "0.2em" }}>TÜKENDİ</span>
                    </div>
                  )}
                  {!p.image && (
                    <div className="absolute top-3 right-3">
                      <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "8px", background: "#11153590", color: "#BC6CFF", padding: "2px 8px", borderRadius: "2px" }}>{p.category}</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 style={{ fontFamily: "var(--font-fuzzy)", fontSize: "1rem", color: "#E9CFE8" }} className="truncate">{p.name}</h3>
                      <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF60", fontSize: "0.8rem", marginTop: "2px" }} className="line-clamp-2">{p.description || p.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid #BC6CFF15" }}>
                    <span style={{ fontFamily: "var(--font-fuzzy)", fontSize: "1.15rem" }} className="neon-text-pink">₺{p.price.toLocaleString("tr-TR")}</span>
                    <div className="flex items-center gap-2">
                      {p.sizes && p.sizes.length > 0 && (
                        <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "8px", color: "#BC6CFF80" }}>{p.sizes.length} beden</span>
                      )}
                      <span className="w-2 h-2 rounded-full" style={{ background: p.stock > 0 ? "#52b788" : "#e63946" }} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* BOTTOM CTA */}
        <div className="text-center mt-16 py-12" style={{ background: "#111535", borderRadius: "4px", border: "1px solid #BC6CFF15" }}>
          <p style={{ fontFamily: "var(--font-fuzzy)", color: "#E9CFE8", fontSize: "1.3rem" }} className="mb-3">Aradığınızı bulamadınız mı?</p>
          <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF60", marginBottom: "16px" }}>Bize ulaşın, size yardımcı olalım.</p>
          <Link href="/dashboard" className="inline-block px-8 py-3 rounded-sm" style={{ fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "0.15em", background: "linear-gradient(135deg, #FF5CA8, #BC6CFF)", color: "#fff" }}>
            Hesabıma Dön
          </Link>
        </div>
      </div>
    </main>
  );
}
