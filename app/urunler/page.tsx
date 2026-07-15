"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getProducts, type Product } from "../lib/db";
import { LilySmall } from "../components/Decorations";

const categories = ["Tümü", "Giyim", "Aksesuar", "Dekorasyon", "Takı", "Çanta", "Elektronik", "Diğer"];

const paintSplashBg = `
  radial-gradient(ellipse 550px 500px at 5% 10%, #FF5CA820 0%, transparent 70%),
  radial-gradient(ellipse 450px 450px at 95% 20%, #00F0FF18 0%, transparent 70%),
  radial-gradient(ellipse 650px 350px at 50% 5%, #BC6CFF15 0%, transparent 70%),
  radial-gradient(ellipse 400px 550px at 15% 85%, #FFB86B12 0%, transparent 70%),
  radial-gradient(ellipse 500px 450px at 90% 80%, #FF5CA810 0%, transparent 70%),
  radial-gradient(ellipse 350px 350px at 60% 50%, #00F0FF10 0%, transparent 70%),
  linear-gradient(180deg, #0B0F2B 0%, #0d1130 40%, #0B0F2B 70%, #080c20 100%)
`;

export default function UrunlerPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Tümü");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getProducts({ category, search }).then((p) => { setProducts(p); setLoading(false); }).catch(() => setLoading(false));
  }, [category, search]);

  return (
    <main style={{ background: paintSplashBg, minHeight: "100vh" }} className="pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "0.5em", textTransform: "uppercase", color: "#00F0FF" }} className="block mb-3 neon-text-cyan">✦ Koleksiyon ✦</span>
          <h1 style={{ fontFamily: "var(--font-fuzzy)", fontSize: "2.5rem" }} className="neon-shimmer">Ürünlerimiz</h1>
          <div className="royal-divider mt-4"><span style={{ color: "#FF5CA8" }}>◆</span></div>
        </div>

        <div className="mb-8">
          <input type="text" placeholder="✦ Ürün ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="fairytale-input w-full px-5 py-4 rounded-sm" style={{ fontFamily: "var(--font-fuzzy)" }} />
        </div>

        <div className="flex gap-2 flex-wrap mb-8 justify-center">
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)} className="px-4 py-2 rounded-sm text-xs tracking-wider uppercase transition-all" style={{ fontFamily: "var(--font-cinzel)", background: category === c ? "linear-gradient(135deg, #FF5CA8, #BC6CFF)" : "#111535", color: category === c ? "#fff" : "#E9CFE8", border: `1px solid ${category === c ? "#FF5CA860" : "#BC6CFF25"}` }}>
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-full animate-spin mx-auto mb-4" style={{ border: "2px solid #BC6CFF30", borderTopColor: "#FF5CA8" }} />
            <p style={{ fontFamily: "var(--font-fuzzy)", color: "#BC6CFF" }}>Yükleniyor...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <LilySmall className="w-16 h-16 mx-auto mb-4 opacity-40" />
            <p style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8", fontSize: "1.2rem" }} className="neon-text-pink">Ürün bulunamadı</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <Link key={p.id} href={`/urun/${p.id}`} className="product-card rounded-sm overflow-hidden group">
                <div className="h-56 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #111535, #1a1040)" }}>
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <LilySmall className="w-20 h-20 opacity-30 group-hover:opacity-50 transition-opacity" />
                  )}
                </div>
                <div className="p-5">
                  <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#00F0FF" }}>{p.category}</span>
                  <h3 style={{ fontFamily: "var(--font-fuzzy)", fontSize: "1.1rem", color: "#E9CFE8", marginTop: "4px" }}>{p.name}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <span style={{ fontFamily: "var(--font-fuzzy)", fontSize: "1.2rem" }} className="neon-text-pink">₺{p.price.toLocaleString("tr-TR")}</span>
                    {p.stock > 0 ? (
                      <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "8px", color: "#00F0FF" }}>Stokta</span>
                    ) : (
                      <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "8px", color: "#FF5CA8" }}>Tükendi</span>
                    )}
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
