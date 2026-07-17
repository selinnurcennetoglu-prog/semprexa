"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTheme } from "../../lib/useTheme";
import { LilySmall } from "../../components/Decorations";

function OdemeBasariliContent() {
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
        <h1 style={{ fontFamily: "var(--font-fuzzy)", color: "#52b788", fontSize: "1.5rem" }} className="mb-3">Odeme Basarili!</h1>
        <p style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", lineHeight: 1.8 }}>
          Siparisiniz basariyla olusturuldu. En kisa surede hazirlanip kargoya verilecektir.
        </p>
        {oid && (
          <p style={{ fontFamily: "var(--font-cinzel)", color: "#BC6CFF", fontSize: "10px", letterSpacing: "0.1em", marginTop: "12px" }}>
            SIPARIS KODU: {oid}
          </p>
        )}
        <div className="flex gap-3 mt-6">
          <Link href="/dashboard" className="flex-1 py-3 rounded-sm text-center" style={{ fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "0.15em", background: "linear-gradient(135deg, #52b788, #00F0FF)", color: "#fff" }}>
            Siparislerim
          </Link>
          <Link href="/magaza" className="flex-1 py-3 rounded-sm text-center" style={{ fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "0.15em", border: "1px solid #BC6CFF40", color: "#BC6CFF" }}>
            Alisverise Don
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function OdemeBasariliPage() {
  return (
    <Suspense fallback={
      <main className="pt-24 pb-16 px-4 flex items-center justify-center" style={{ minHeight: "100vh", background: "#0B0F2B" }}>
        <div className="w-12 h-12 rounded-full animate-spin" style={{ border: "2px solid #BC6CFF30", borderTopColor: "#FF5CA8" }} />
      </main>
    }>
      <OdemeBasariliContent />
    </Suspense>
  );
}
