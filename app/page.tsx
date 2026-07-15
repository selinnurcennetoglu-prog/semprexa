"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getProducts, type Product } from "./lib/db";
import { LilyFlower, LilySmall } from "./components/Decorations";

function Sparkles() {
  const dots = Array.from({ length: 18 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 6}s`,
    size: `${2 + Math.random() * 4}px`,
  }));
  return (
    <>
      {dots.map((d, i) => (
        <div key={i} className="sparkle-dot" style={{ left: d.left, top: d.top, animationDelay: d.delay, width: d.size, height: d.size }} />
      ))}
    </>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((p) => { setProducts(p.slice(0, 6)); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <main style={{ background: "#191B37", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <Sparkles />

      {/* Decorative lilies */}
      <LilyFlower className="absolute left-4 top-20 w-20 h-32 opacity-40 hidden lg:block" style={{ animationDelay: "0s" }} />
      <LilyFlower className="absolute right-8 top-40 w-16 h-28 opacity-30 hidden lg:block" style={{ transform: "scaleX(-1)", animationDelay: "1s" }} />
      <LilyFlower className="absolute left-1/4 bottom-20 w-14 h-24 opacity-20 hidden lg:block" style={{ animationDelay: "2s" }} />
      <LilyFlower className="absolute right-1/3 bottom-32 w-18 h-30 opacity-25 hidden lg:block" style={{ transform: "scaleX(-1)", animationDelay: "0.5s" }} />

      {/* Hero */}
      <section className="relative z-10 pt-32 pb-20 px-6 text-center">
        <LilySmall className="absolute left-10 top-28 w-8 h-8 opacity-40 hidden md:block" />
        <LilySmall className="absolute right-16 top-36 w-6 h-6 opacity-30 hidden md:block" />

        <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "0.5em", textTransform: "uppercase", color: "#872D72" }} className="block mb-4">
          ✦ Özel Koleksiyon ✦
        </span>

        <h1 style={{ fontFamily: "var(--font-yuyu)", fontSize: "clamp(2.5rem, 8vw, 5rem)", color: "#E9CFE8", lineHeight: 1.1 }} className="mb-6">
          Semprexa
        </h1>

        <p style={{ fontFamily: "var(--font-fuzzy)", fontSize: "1.2rem", color: "#DE5C8F", maxWidth: "500px", margin: "0 auto" }} className="mb-4">
          Özenle seçilmiş, benzersiz ürünler
        </p>

        <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1rem", color: "#872D72", maxWidth: "450px", margin: "0 auto" }}>
          Her parçada zarafet ve kalite buluşuyor
        </p>

        <div className="royal-divider mt-8 mb-10">
          <span style={{ color: "#E21C70" }}>✦</span>
        </div>

        <Link href="/urunler" className="inline-block px-10 py-4 transition-all hover:translate-y-[-2px]" style={{ background: "linear-gradient(135deg, #E21C70, #872D72)", color: "#fff", fontFamily: "var(--font-cinzel)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", border: "1px solid #E21C7060", boxShadow: "0 4px 20px #E21C7030" }}>
          ✦ Ürünleri Keşfet ✦
        </Link>
      </section>

      {/* Featured Products */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 style={{ fontFamily: "var(--font-rubik)", fontSize: "2rem", color: "#E21C70" }} className="mb-2">
            Öne Çıkanlar
          </h2>
          <div className="royal-divider">
            <span style={{ color: "#7C4EBB" }}>◆</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-full animate-spin mx-auto mb-4" style={{ border: "2px solid #7C4EBB30", borderTopColor: "#E21C70" }} />
            <p style={{ fontFamily: "var(--font-fuzzy)", color: "#872D72" }}>Yükleniyor...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <LilySmall className="w-16 h-16 mx-auto mb-4 opacity-40" />
            <p style={{ fontFamily: "var(--font-fuzzy)", color: "#872D72", fontSize: "1.2rem" }}>Henüz ürün eklenmemiş</p>
            <p style={{ fontFamily: "var(--font-cormorant)", color: "#411E57" }}>Admin panelinden ürün ekleyebilirsiniz</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <h3 style={{ fontFamily: "var(--font-yuyu)", fontSize: "1.2rem", color: "#E9CFE8", marginTop: "4px" }}>{p.name}</h3>
                  <p style={{ fontFamily: "var(--font-fuzzy)", fontSize: "1.3rem", color: "#E21C70", marginTop: "8px" }}>₺{p.price.toLocaleString("tr-TR")}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {products.length > 0 && (
          <div className="text-center mt-12">
            <Link href="/urunler" className="inline-block px-8 py-3 transition-all" style={{ border: "1px solid #E21C7040", color: "#E21C70", fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              Tüm Ürünleri Gör
            </Link>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t" style={{ borderColor: "#7C4EBB15" }}>
        <div className="max-w-6xl mx-auto text-center">
          <img src="/logo.svg" alt="Semprexa" className="h-12 mx-auto mb-4 opacity-60" />
          <p style={{ fontFamily: "var(--font-cormorant)", color: "#411E57", fontSize: "0.85rem" }}>
            © 2026 Semprexa. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </main>
  );
}
