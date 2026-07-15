"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getProducts, type Product } from "../lib/db";
import { LilySmall } from "../components/Decorations";

const categories = ["Tümü", "Giyim", "Aksesuar", "Dekorasyon", "Takı", "Çanta", "Elektronik", "Diğer"];

export default function UrunlerPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Tümü");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getProducts({ category, search }).then((p) => { setProducts(p); setLoading(false); }).catch(() => setLoading(false));
  }, [category, search]);

  return (
    <main style={{ background: "#191B37", minHeight: "100vh" }} className="pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "0.5em", textTransform: "uppercase", color: "#872D72" }} className="block mb-3">✦ Koleksiyon ✦</span>
          <h1 style={{ fontFamily: "var(--font-yuyu)", fontSize: "2.5rem", color: "#E21C70" }}>Ürünlerimiz</h1>
          <div className="royal-divider mt-4"><span style={{ color: "#7C4EBB" }}>◆</span></div>
        </div>

        <div className="mb-8">
          <input type="text" placeholder="✦ Ürün ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="fairytale-input w-full px-5 py-4 rounded-sm" style={{ fontFamily: "var(--font-fuzzy)" }} />
        </div>

        <div className="flex gap-2 flex-wrap mb-8 justify-center">
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)} className="px-4 py-2 rounded-sm text-xs tracking-wider uppercase transition-all" style={{ fontFamily: "var(--font-cinzel)", background: category === c ? "#E21C70" : "#1f1d3a", color: category === c ? "#fff" : "#EDABBE", border: `1px solid ${category === c ? "#E21C70" : "#7C4EBB30"}` }}>
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-full animate-spin mx-auto mb-4" style={{ border: "2px solid #7C4EBB30", borderTopColor: "#E21C70" }} />
            <p style={{ fontFamily: "var(--font-fuzzy)", color: "#872D72" }}>Yükleniyor...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <LilySmall className="w-16 h-16 mx-auto mb-4 opacity-40" />
            <p style={{ fontFamily: "var(--font-fuzzy)", color: "#872D72", fontSize: "1.2rem" }}>Ürün bulunamadı</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <Link key={p.id} href={`/urun/${p.id}`} className="product-card rounded-sm overflow-hidden group">
                <div className="h-56 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1f1d3a, #411E57)" }}>
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <LilySmall className="w-20 h-20 opacity-30 group-hover:opacity-50 transition-opacity" />
                  )}
                </div>
                <div className="p-5">
                  <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7C4EBB" }}>{p.category}</span>
                  <h3 style={{ fontFamily: "var(--font-yuyu)", fontSize: "1.1rem", color: "#E9CFE8", marginTop: "4px" }}>{p.name}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <span style={{ fontFamily: "var(--font-fuzzy)", fontSize: "1.2rem", color: "#E21C70" }}>₺{p.price.toLocaleString("tr-TR")}</span>
                    {p.stock > 0 ? (
                      <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "8px", color: "#7C4EBB" }}>Stokta</span>
                    ) : (
                      <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "8px", color: "#AE0849" }}>Tükendi</span>
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
