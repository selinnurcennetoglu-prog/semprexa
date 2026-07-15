"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getProducts, type Product } from "./lib/db";
import { LilyLarge, LilyMedium, LilySmall, PetalFloat, Butterfly } from "./components/Decorations";

function FallingPetals() {
  const petals = Array.from({ length: 25 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 12}s`,
    duration: `${7 + Math.random() * 10}s`,
    size: `${14 + Math.random() * 28}px`,
    type: Math.random() > 0.5 ? "falling-petal" : "falling-petal-2",
  }));
  return (
    <>
      {petals.map((p, i) => (
        <div key={i} className={p.type} style={{ left: p.left, top: "-5%", animationDelay: p.delay, animationDuration: p.duration }}>
          <PetalFloat className="w-full h-full" style={{ width: p.size, height: p.size }} />
        </div>
      ))}
    </>
  );
}

function Sparkles() {
  const dots = Array.from({ length: 30 }, (_, i) => ({
    left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, delay: `${Math.random() * 6}s`, size: `${2 + Math.random() * 5}px`,
  }));
  return (<>{dots.map((d, i) => (<div key={i} className="sparkle-dot" style={{ left: d.left, top: d.top, animationDelay: d.delay, width: d.size, height: d.size }} />))}</>);
}

function Butterflies() {
  const bflies = [
    { left: "10%", top: "20%", size: "40px", path: "butterfly-path-1", delay: "0s" },
    { left: "70%", top: "15%", size: "35px", path: "butterfly-path-2", delay: "3s" },
    { left: "40%", top: "60%", size: "30px", path: "butterfly-path-3", delay: "6s" },
    { left: "85%", top: "50%", size: "38px", path: "butterfly-path-1", delay: "9s" },
    { left: "20%", top: "75%", size: "32px", path: "butterfly-path-2", delay: "2s" },
    { left: "55%", top: "35%", size: "28px", path: "butterfly-path-3", delay: "5s" },
  ];
  return (
    <>
      {bflies.map((b, i) => (
        <div key={i} className={`flying-butterfly ${b.path}`} style={{ left: b.left, top: b.top, animationDelay: b.delay }}>
          <Butterfly className="w-full h-full" style={{ width: b.size, height: b.size, filter: "drop-shadow(0 0 8px #FF5CA840) drop-shadow(0 0 15px #00F0FF20)" }} />
        </div>
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
    <main style={{
      minHeight: "100vh",
      position: "relative",
      overflow: "hidden",
      background: `
        radial-gradient(ellipse 600px 600px at 5% 15%, #FF5CA830 0%, transparent 70%),
        radial-gradient(ellipse 500px 500px at 92% 25%, #00F0FF25 0%, transparent 70%),
        radial-gradient(ellipse 700px 400px at 50% 8%, #BC6CFF20 0%, transparent 70%),
        radial-gradient(ellipse 400px 600px at 15% 60%, #FFB86B20 0%, transparent 70%),
        radial-gradient(ellipse 500px 500px at 85% 70%, #FF5CA818 0%, transparent 70%),
        radial-gradient(ellipse 600px 300px at 40% 90%, #00F0FF15 0%, transparent 70%),
        radial-gradient(ellipse 350px 350px at 70% 45%, #BC6CFF20 0%, transparent 70%),
        radial-gradient(ellipse 450px 450px at 25% 35%, #FFB86B18 0%, transparent 70%),
        radial-gradient(ellipse 300px 500px at 60% 55%, #FF5CA812 0%, transparent 70%),
        radial-gradient(ellipse 500px 350px at 10% 85%, #00F0FF18 0%, transparent 70%),
        radial-gradient(ellipse 400px 400px at 78% 10%, #BC6CFF15 0%, transparent 70%),
        radial-gradient(ellipse 350px 350px at 35% 75%, #FF5CA815 0%, transparent 70%),
        linear-gradient(180deg, #0B0F2B 0%, #0d1130 30%, #0B0F2B 60%, #080c20 100%)
      `
    }}>
      <FallingPetals />
      <Sparkles />
      <Butterflies />

      {/* ── LILY SÜSLEMELERİ ── */}
      <LilyLarge className="absolute left-0 top-10 w-36 h-52 animate-lily-sway opacity-50 hidden lg:block" style={{ animationDelay: "0s" }} />
      <LilyMedium className="absolute left-12 top-[40%] w-24 h-36 animate-lily-float opacity-40 hidden lg:block" style={{ animationDelay: "1s" }} />
      <LilySmall className="absolute left-6 bottom-[20%] w-14 h-20 animate-lily-sway opacity-35 hidden lg:block" style={{ animationDelay: "2s" }} />
      <LilyLarge className="absolute right-0 top-20 w-36 h-52 animate-lily-sway-reverse opacity-45 hidden lg:block" style={{ animationDelay: "0.5s" }} />
      <LilyMedium className="absolute right-8 top-[45%] w-24 h-36 animate-lily-float opacity-35 hidden lg:block" style={{ animationDelay: "1.5s" }} />
      <LilySmall className="absolute right-4 bottom-[15%] w-14 h-20 animate-lily-sway opacity-40 hidden lg:block" style={{ animationDelay: "2.5s" }} />
      <LilyMedium className="absolute left-[15%] top-[5%] w-20 h-32 animate-petal-bloom opacity-30 hidden md:block" style={{ animationDelay: "0.8s" }} />
      <LilyMedium className="absolute right-[15%] top-[8%] w-20 h-32 animate-petal-bloom opacity-25 hidden md:block" style={{ animationDelay: "1.8s" }} />
      <LilySmall className="absolute left-[30%] top-[60%] w-12 h-16 animate-lily-float opacity-20 hidden lg:block" style={{ animationDelay: "3.5s" }} />
      <LilySmall className="absolute right-[30%] top-[55%] w-12 h-16 animate-lily-float opacity-20 hidden lg:block" style={{ animationDelay: "4.5s" }} />
      <LilyLarge className="absolute left-24 bottom-[5%] w-28 h-44 animate-lily-sway-reverse opacity-25 hidden xl:block" style={{ animationDelay: "3s" }} />
      <LilyLarge className="absolute right-20 bottom-[8%] w-28 h-44 animate-lily-sway opacity-20 hidden xl:block" style={{ animationDelay: "4s" }} />
      <LilyMedium className="absolute left-[8%] top-[70%] w-18 h-28 animate-lily-sway opacity-15 hidden xl:block" style={{ animationDelay: "2.2s" }} />
      <LilyMedium className="absolute right-[8%] top-[65%] w-18 h-28 animate-lily-sway-reverse opacity-15 hidden xl:block" style={{ animationDelay: "3.2s" }} />

      {/* Hero */}
      <section className="relative z-10 pt-32 pb-20 px-6 text-center">
        <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "0.5em", textTransform: "uppercase", color: "#00F0FF" }} className="block mb-4 neon-text-cyan">
          ✦ Özel Koleksiyon ✦
        </span>

        <h1 style={{ fontFamily: "var(--font-fuzzy)", fontSize: "clamp(3rem, 10vw, 6rem)", lineHeight: 1.1 }} className="mb-4 neon-shimmer">
          Semprexa
        </h1>

        <p style={{ fontFamily: "var(--font-fuzzy)", fontSize: "1.3rem", color: "#FF5CA8", maxWidth: "500px", margin: "0 auto" }} className="mb-3 neon-text-pink">
          Özenle seçilmiş, benzersiz ürünler
        </p>

        <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.1rem", color: "#BC6CFF", maxWidth: "450px", margin: "0 auto" }} className="neon-text-purple">
          Her parçada zarafet ve kalite buluşuyor
        </p>

        <div className="royal-divider mt-8 mb-10">
          <LilySmall className="w-6 h-8 animate-petal-bloom" />
        </div>

        <Link href="/urunler" className="inline-block px-10 py-4 transition-all hover:translate-y-[-2px]" style={{ background: "linear-gradient(135deg, #FF5CA8, #BC6CFF)", color: "#fff", fontFamily: "var(--font-cinzel)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", border: "1px solid #FF5CA860", boxShadow: "0 4px 20px #FF5CA840, 0 0 40px #BC6CFF20" }}>
          ✦ Ürünleri Keşfet ✦
        </Link>
      </section>

      {/* Featured Products */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 style={{ fontFamily: "var(--font-fuzzy)", fontSize: "2rem" }} className="mb-2 neon-text-pink">Öne Çıkanlar</h2>
          <div className="royal-divider"><span style={{ color: "#00F0FF" }}>◆</span></div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-full animate-spin mx-auto mb-4" style={{ border: "2px solid #BC6CFF30", borderTopColor: "#FF5CA8" }} />
            <p style={{ fontFamily: "var(--font-fuzzy)", color: "#BC6CFF" }}>Yükleniyor...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <LilyMedium className="w-24 h-36 mx-auto mb-4 opacity-30 animate-lily-float" />
            <p style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8", fontSize: "1.2rem" }} className="neon-text-pink">Henüz ürün eklenmemiş</p>
            <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF" }}>Admin panelinden ürün ekleyebilirsiniz</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <Link key={p.id} href={`/urun/${p.id}`} className="product-card rounded-sm overflow-hidden group">
                <div className="h-56 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #111535, #1a1040)" }}>
                  {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <LilySmall className="w-20 h-20 opacity-30 group-hover:opacity-50 transition-opacity animate-lily-float" />}
                </div>
                <div className="p-5">
                  <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#00F0FF" }}>{p.category}</span>
                  <h3 style={{ fontFamily: "var(--font-fuzzy)", fontSize: "1.2rem", color: "#E9CFE8", marginTop: "4px" }}>{p.name}</h3>
                  <p style={{ fontFamily: "var(--font-fuzzy)", fontSize: "1.3rem", marginTop: "8px" }} className="neon-text-pink">₺{p.price.toLocaleString("tr-TR")}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {products.length > 0 && (
          <div className="text-center mt-12">
            <Link href="/urunler" className="inline-block px-8 py-3 transition-all" style={{ border: "1px solid #FF5CA840", fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              <span className="neon-text-cyan">Tüm Ürünleri Gör</span>
            </Link>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t" style={{ borderColor: "#BC6CFF15" }}>
        <div className="max-w-6xl mx-auto text-center">
          <img src="/logo.svg" alt="Semprexa" className="h-12 mx-auto mb-4 opacity-60" />
          <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF", fontSize: "0.85rem" }}>© 2026 Semprexa. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </main>
  );
}
