"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTheme } from "../../lib/useTheme";
import { LilySmall } from "../../components/Decorations";

export default function HavalePage() {
  const { bg } = useTheme();
  const searchParams = useSearchParams();
  const oid = searchParams.get("oid");
  const total = searchParams.get("total");

  return (
    <main style={{ background: bg, minHeight: "100vh" }} className="pt-24 pb-16 px-4 flex items-center justify-center">
      <div className="max-w-md w-full text-center p-8 rounded-sm" style={{ background: "#111535", border: "1px solid #FFB86B40" }}>
        <LilySmall className="w-12 h-12 mx-auto mb-4 opacity-40" />
        <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "#FFB86B20", border: "2px solid #FFB86B" }}>
          <span style={{ fontSize: "2rem", color: "#FFB86B" }}>🏦</span>
        </div>
        <h1 style={{ fontFamily: "var(--font-fuzzy)", color: "#FFB86B", fontSize: "1.5rem" }} className="mb-3">Siparişiniz Alındı!</h1>
        <p style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", lineHeight: 1.8 }}>
          Havale/EFT ödemenizi bekliyoruz. Ödeme onaylandıktan sonra siparişiniz hazırlanmaya başlayacaktır.
        </p>

        {oid && (
          <div className="mt-4 p-4 rounded-sm" style={{ background: "#0d1130", border: "1px solid #BC6CFF20" }}>
            <p style={{ fontFamily: "var(--font-cinzel)", color: "#BC6CFF80", fontSize: "9px", letterSpacing: "0.1em", marginBottom: "4px" }}>SİPARİŞ KODU</p>
            <p style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8", fontSize: "1.3rem" }}>{oid}</p>
          </div>
        )}

        {total && (
          <div className="mt-3 p-4 rounded-sm" style={{ background: "#0d1130", border: "1px solid #BC6CFF20" }}>
            <p style={{ fontFamily: "var(--font-cinzel)", color: "#BC6CFF80", fontSize: "9px", letterSpacing: "0.1em", marginBottom: "4px" }}>ÖDENECEK TUTAR</p>
            <p style={{ fontFamily: "var(--font-fuzzy)", color: "#FFB86B", fontSize: "1.3rem" }}>₺{Number(total).toLocaleString("tr-TR")}</p>
          </div>
        )}

        <div className="mt-4 p-4 rounded-sm" style={{ background: "#FFB86B10", border: "1px solid #FFB86B20" }}>
          <p style={{ fontFamily: "var(--font-cormorant)", color: "#FFB86B", fontSize: "0.85rem", lineHeight: 1.6 }}>
            <strong>Garanti BBVA</strong><br />
            Hesap Sahibi: Emel Cennetoğlu<br />
            IBAN: TR87 0006 7010 0000 0026 4162 88<br />
            <strong>Açıklamaya sipariş kodunuzu yazmayı unutmayın.</strong>
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <Link href="/dashboard" className="flex-1 py-3 rounded-sm text-center" style={{ fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "0.15em", background: "linear-gradient(135deg, #FFB86B, #FF5CA8)", color: "#fff" }}>
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
