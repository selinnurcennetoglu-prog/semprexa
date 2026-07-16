"use client";

import { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LilySmall } from "../../components/Decorations";

function BasariliContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "SPX0000000";

  useEffect(() => {
    localStorage.removeItem("semprexa_cart");
  }, []);

  return (
    <main style={{
      background: `
        radial-gradient(ellipse 500px 500px at 50% 30%, #00F0FF15 0%, transparent 70%),
        radial-gradient(ellipse 400px 400px at 20% 60%, #FF5CA810 0%, transparent 70%),
        linear-gradient(180deg, #0B0F2B 0%, #0d1130 50%, #080c20 100%)
      `,
      minHeight: "100vh",
    }} className="flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center" style={{
            background: "linear-gradient(135deg, #00F0FF20, #00F0FF05)",
            border: "2px solid #00F0FF40",
            boxShadow: "0 0 40px #00F0FF20, 0 0 80px #00F0FF10",
          }}>
            <span className="neon-text-cyan" style={{ fontSize: "3rem" }}>✓</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full animate-ping opacity-20" style={{ border: "1px solid #00F0FF" }} />
          </div>
        </div>

        <h1 style={{ fontFamily: "var(--font-fuzzy)", color: "#00F0FF", fontSize: "2rem" }} className="mb-3 neon-text-cyan">Siparişiniz Alındı!</h1>
        <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF" }} className="mb-2">Ödemeniz başarıyla tamamlandı.</p>

        <div className="my-8 p-6 rounded-sm" style={{ background: "#111535", border: "1px solid #BC6CFF20" }}>
          <p style={{ fontFamily: "var(--font-cinzel)", color: "#BC6CFF80", fontSize: "9px", letterSpacing: "0.15em" }}>SİPARİŞ NUMARASI</p>
          <p style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8", fontSize: "1.4rem" }} className="mt-1 neon-text-pink">{orderId}</p>
          <div className="mt-4 pt-4" style={{ borderTop: "1px solid #BC6CFF15" }}>
            <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF" }}>Siparişiniz en kısa sürede kargoya verilecektir.</p>
            <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF80", fontSize: "0.85rem" }} className="mt-1">Kargo bilgileri e-posta adresinize gönderilecektir.</p>
          </div>
        </div>

        <div className="space-y-3">
          <Link href="/urunler" className="block w-full py-4 rounded-sm" style={{
            background: "linear-gradient(135deg, #FF5CA8, #BC6CFF)",
            color: "#fff",
            fontFamily: "var(--font-cinzel)",
            fontSize: "11px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
          }}>
            ✦ Alışverişe Devam Et
          </Link>
          <Link href="/" className="block w-full py-4 rounded-sm" style={{
            border: "1px solid #BC6CFF40",
            color: "#BC6CFF",
            fontFamily: "var(--font-cinzel)",
            fontSize: "11px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
          }}>
            Ana Sayfaya Dön
          </Link>
        </div>

        <div className="mt-10">
          <LilySmall className="w-10 h-10 mx-auto opacity-20" />
        </div>
      </div>
    </main>
  );
}

export default function BasariliPage() {
  return (
    <Suspense fallback={
      <main style={{ background: "#0B0F2B", minHeight: "100vh" }} className="flex items-center justify-center">
        <div className="w-12 h-12 rounded-full animate-spin" style={{ border: "2px solid #00F0FF30", borderTopColor: "#00F0FF" }} />
      </main>
    }>
      <BasariliContent />
    </Suspense>
  );
}
