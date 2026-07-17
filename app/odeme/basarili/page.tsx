"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTheme } from "../../lib/useTheme";
import { LilySmall } from "../../components/Decorations";

export default function OdemeBasariliPage() {
  const { bg } = useTheme();
  const searchParams = useSearchParams();
  const oid = searchParams.get("oid");

  return (
    <main style={{ background: bg, minHeight: "100vh" }} className="pt-24 pb-16 px-4 flex items-center justify-center">
      <div className="max-w-md w-full text-center p-8 rounded-sm" style={{ background: "#111535", border: "1px solid #52b78840" }}>
        <LilySmall className="w-12 h-12 mx-auto mb-4 opacity-40" />
        <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "#52b78820", border: "2px solid #52b788" }}>
          <span style={{ fontSize: "2rem", color: "#52b788" }}>✓</span>
        </div>
        <h1 style={{ fontFamily: "var(--font-fuzzy)", color: "#52b788", fontSize: "1.5rem" }} className="mb-3">Ödeme Başarılı!</h1>
        <p style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", lineHeight: 1.8 }}>
          Siparişiniz başarıyla oluşturuldu. En kısa sürede hazırlanıp kargoya verilecektir.
        </p>
        {oid && (
          <p style={{ fontFamily: "var(--font-cinzel)", color: "#BC6CFF", fontSize: "10px", letterSpacing: "0.1em", marginTop: "12px" }}>
            SİPARİŞ KODU: {oid}
          </p>
        )}
        <div className="flex gap-3 mt-6">
          <Link href="/dashboard" className="flex-1 py-3 rounded-sm text-center" style={{ fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "0.15em", background: "linear-gradient(135deg, #52b788, #00F0FF)", color: "#fff" }}>
            Siparişlerim
          </Link>
          <Link href="/urunler" className="flex-1 py-3 rounded-sm text-center" style={{ fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "0.15em", border: "1px solid #BC6CFF40", color: "#BC6CFF" }}>
            Alışverişe Dön
          </Link>
        </div>
      </div>
    </main>
  );
}
