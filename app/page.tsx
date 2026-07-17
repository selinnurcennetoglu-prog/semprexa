"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getProducts, type Product } from "./lib/db";
import { LilyLarge, LilyMedium, LilySmall, PetalFloat, Butterfly, IvyVine, NeonTree, RoseFlower, DaisyFlower, Rosebud, LeafCluster } from "./components/Decorations";
import WelcomeLetter from "./components/WelcomeLetter";
import MusicPlayer from "./components/MusicPlayer";
import SocialCircle from "./components/SocialCircle";
import ThemeSelector from "./components/ThemeSelector";
import ThemeDecorations from "./components/ThemeDecorations";
import { useTheme } from "./lib/useTheme";

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
  const { bg } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  useEffect(() => {
    getProducts().then((p) => { setProducts(p.slice(0, 6)); setLoading(false); }).catch(() => setLoading(false));
    const hasTheme = localStorage.getItem("semprexa_theme");
    if (!hasTheme) {
      const timer = setTimeout(() => setShowWelcome(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const closeWelcome = () => {
    setShowWelcome(false);
    setShowThemeSelector(true);
  };

  const handleThemeSelect = (theme: string) => {
    localStorage.setItem("semprexa_theme", theme);
    setShowThemeSelector(false);
  };

  const handleThemeSkip = () => {
    setShowThemeSelector(false);
  };

  return (
    <main style={{
      minHeight: "100vh",
      position: "relative",
      overflow: "hidden",
      background: bg,
    }}>
      <FallingPetals />
      <Sparkles />
      <Butterflies />
      <ThemeDecorations />

      {/* ── WELCOME LETTER ── */}
      {showWelcome && <WelcomeLetter onClose={closeWelcome} />}

      {/* ── THEME SELECTOR ── */}
      {showThemeSelector && <ThemeSelector onSelect={handleThemeSelect} onSkip={handleThemeSkip} />}

      {/* ── MUSIC PLAYER ── */}
      <MusicPlayer triggerPlay={showWelcome} />

      {/* ── SOCIAL CIRCLE ── */}
      <SocialCircle />

      {/* ── SARMAŞIK (IVY VINES) ── */}
      <IvyVine variant="left" className="absolute left-0 top-0 w-16 h-96 animate-vine-sway opacity-60 hidden lg:block" style={{ animationDelay: "0s" }} />
      <IvyVine variant="right" className="absolute right-0 top-0 w-16 h-96 animate-vine-sway-reverse opacity-55 hidden lg:block" style={{ animationDelay: "1s" }} />
      <IvyVine variant="left" className="absolute left-[5%] top-[20%] w-12 h-72 animate-vine-sway opacity-40 hidden xl:block" style={{ animationDelay: "2s" }} />
      <IvyVine variant="right" className="absolute right-[5%] top-[25%] w-12 h-72 animate-vine-sway-reverse opacity-35 hidden xl:block" style={{ animationDelay: "3s" }} />
      <IvyVine variant="left" className="absolute left-0 bottom-0 w-14 h-80 animate-vine-sway opacity-45 hidden lg:block" style={{ animationDelay: "4s" }} />
      <IvyVine variant="right" className="absolute right-0 bottom-0 w-14 h-80 animate-vine-sway-reverse opacity-40 hidden lg:block" style={{ animationDelay: "5s" }} />

      {/* ── NEON AĞAÇLAR ── */}
      <NeonTree className="absolute left-[-2%] bottom-0 w-40 h-72 animate-tree-sway opacity-50 hidden xl:block" style={{ animationDelay: "0s" }} />
      <NeonTree className="absolute right-[-2%] bottom-0 w-40 h-72 animate-tree-sway opacity-45 hidden xl:block" style={{ animationDelay: "2s" }} />
      <NeonTree className="absolute left-[8%] bottom-[5%] w-28 h-52 animate-tree-sway opacity-30 hidden 2xl:block" style={{ animationDelay: "1s" }} />
      <NeonTree className="absolute right-[8%] bottom-[5%] w-28 h-52 animate-tree-sway opacity-28 hidden 2xl:block" style={{ animationDelay: "3s" }} />

      {/* ── ÇOĞALAN ÇİÇEKLER ── */}
      <RoseFlower className="absolute left-[12%] top-[15%] w-16 h-20 animate-flower-multiply opacity-35 hidden lg:block" style={{ animationDelay: "0s" }} />
      <RoseFlower className="absolute right-[12%] top-[18%] w-14 h-18 animate-flower-multiply opacity-30 hidden lg:block" style={{ animationDelay: "2s" }} />
      <RoseFlower className="absolute left-[25%] top-[70%] w-12 h-16 animate-bud-bloom opacity-25 hidden xl:block" style={{ animationDelay: "1s" }} />
      <RoseFlower className="absolute right-[25%] top-[65%] w-12 h-16 animate-bud-bloom opacity-22 hidden xl:block" style={{ animationDelay: "3s" }} />

      <DaisyFlower className="absolute left-[18%] top-[35%] w-14 h-18 animate-flower-multiply opacity-30 hidden lg:block" style={{ animationDelay: "1.5s" }} />
      <DaisyFlower className="absolute right-[18%] top-[40%] w-12 h-16 animate-flower-multiply opacity-25 hidden lg:block" style={{ animationDelay: "3.5s" }} />
      <DaisyFlower className="absolute left-[35%] top-[80%] w-10 h-14 animate-bud-bloom opacity-20 hidden xl:block" style={{ animationDelay: "0.5s" }} />
      <DaisyFlower className="absolute right-[35%] top-[75%] w-10 h-14 animate-bud-bloom opacity-18 hidden xl:block" style={{ animationDelay: "2.5s" }} />

      <Rosebud className="absolute left-[8%] top-[55%] w-10 h-14 animate-bud-bloom opacity-28 hidden lg:block" style={{ animationDelay: "0.8s" }} />
      <Rosebud className="absolute right-[8%] top-[50%] w-10 h-14 animate-bud-bloom opacity-25 hidden lg:block" style={{ animationDelay: "2.8s" }} />
      <Rosebud className="absolute left-[22%] bottom-[25%] w-8 h-12 animate-flower-multiply opacity-20 hidden xl:block" style={{ animationDelay: "1.8s" }} />
      <Rosebud className="absolute right-[22%] bottom-[20%] w-8 h-12 animate-flower-multiply opacity-18 hidden xl:block" style={{ animationDelay: "3.8s" }} />

      {/* ── YAPRAK KÜMELERİ ── */}
      <LeafCluster className="absolute left-[5%] top-[30%] w-12 h-8 animate-leaf-breathe opacity-25 hidden lg:block" style={{ animationDelay: "0s" }} />
      <LeafCluster className="absolute right-[5%] top-[35%] w-12 h-8 animate-leaf-breathe opacity-22 hidden lg:block" style={{ animationDelay: "2s" }} />
      <LeafCluster className="absolute left-[15%] bottom-[35%] w-10 h-6 animate-leaf-breathe opacity-18 hidden xl:block" style={{ animationDelay: "1s" }} />
      <LeafCluster className="absolute right-[15%] bottom-[30%] w-10 h-6 animate-leaf-breathe opacity-15 hidden xl:block" style={{ animationDelay: "3s" }} />

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
      <LilySmall className="absolute left-[40%] top-[12%] w-10 h-14 animate-petal-bloom opacity-15 hidden 2xl:block" style={{ animationDelay: "0.3s" }} />
      <LilySmall className="absolute right-[40%] top-[14%] w-10 h-14 animate-petal-bloom opacity-12 hidden 2xl:block" style={{ animationDelay: "1.3s" }} />
      <LilyLarge className="absolute left-[3%] top-[45%] w-20 h-32 animate-lily-sway opacity-18 hidden 2xl:block" style={{ animationDelay: "5s" }} />
      <LilyLarge className="absolute right-[3%] top-[42%] w-20 h-32 animate-lily-sway-reverse opacity-15 hidden 2xl:block" style={{ animationDelay: "6s" }} />
      <LilyMedium className="absolute left-[45%] bottom-[10%] w-16 h-24 animate-lily-float opacity-12 hidden 2xl:block" style={{ animationDelay: "4.2s" }} />
      <LilyMedium className="absolute right-[45%] bottom-[12%] w-16 h-24 animate-lily-float opacity-10 hidden 2xl:block" style={{ animationDelay: "5.2s" }} />

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
