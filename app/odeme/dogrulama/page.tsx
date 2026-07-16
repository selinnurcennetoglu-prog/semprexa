"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function DogrulamaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const orderId = searchParams.get("orderId");
  const bank = searchParams.get("bank") || "Banka";

  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [countdown, setCountdown] = useState(59);
  const [resending, setResending] = useState(false);

  const isSuccess = status === "ok";

  useEffect(() => {
    if (!isSuccess) return;
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(timer); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSuccess]);

  if (!isSuccess) {
    return (
      <main style={{
        background: "linear-gradient(180deg, #0B0F2B 0%, #0d1130 50%, #080c20 100%)",
        minHeight: "100vh",
      }} className="flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: "#FF5CA820", border: "2px solid #FF5CA840" }}>
            <span style={{ fontSize: "2rem" }}>✕</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8", fontSize: "1.8rem" }} className="mb-3">Ödeme Başarısız</h1>
          <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF" }} className="mb-2">Ödeme işlemi tamamlanamadı.</p>
          <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF80", fontSize: "0.85rem" }} className="mb-8">Sipariş No: {orderId}</p>
          <div className="space-y-3">
            <Link href="/odeme" className="block w-full py-4 rounded-sm" style={{ background: "linear-gradient(135deg, #FF5CA8, #BC6CFF)", color: "#fff", fontFamily: "var(--font-cinzel)", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              Tekrar Dene
            </Link>
            <Link href="/sepet" className="block w-full py-4 rounded-sm" style={{ border: "1px solid #BC6CFF40", color: "#BC6CFF", fontFamily: "var(--font-cinzel)", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              Sepete Dön
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const handleVerify = () => {
    if (code.length < 4) {
      setError(true);
      return;
    }
    setVerified(true);
    sessionStorage.removeItem("semprexa_order");
    localStorage.removeItem("semprexa_cart");
    setTimeout(() => router.push("/odeme/basarili?orderId=" + orderId), 1500);
  };

  if (verified) {
    return (
      <main style={{
        background: "linear-gradient(180deg, #0B0F2B 0%, #0d1130 50%, #080c20 100%)",
        minHeight: "100vh",
      }} className="flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center animate-bounce" style={{ background: "#00F0FF20", border: "2px solid #00F0FF40" }}>
            <span className="neon-text-cyan" style={{ fontSize: "2rem" }}>✓</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-fuzzy)", color: "#00F0FF", fontSize: "1.8rem" }} className="mb-3 neon-text-cyan">Doğrulandı!</h1>
          <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF" }}>Ödeme onaylandı, siparişiniz oluşturuluyor...</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{
      background: "linear-gradient(180deg, #0B0F2B 0%, #0d1130 50%, #080c20 100%)",
      minHeight: "100vh",
    }} className="flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="p-8 rounded-sm" style={{ background: "#111535", border: "1px solid #BC6CFF30" }}>

          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FFB86B20, #FF5CA820)", border: "1px solid #FFB86B40" }}>
              <span style={{ fontSize: "1.5rem" }}>🏦</span>
            </div>
            <h1 style={{ fontFamily: "var(--font-fuzzy)", color: "#FFB86B", fontSize: "1.4rem" }}>{bank}</h1>
            <p style={{ fontFamily: "var(--font-cinzel)", color: "#BC6CFF80", fontSize: "10px", letterSpacing: "0.15em", marginTop: "4px" }}>3D SECURE DOĞRULAMA</p>
          </div>

          <div className="p-4 rounded-sm mb-6" style={{ background: "#0d1130", border: "1px solid #BC6CFF20" }}>
            <div className="flex justify-between items-center">
              <div>
                <p style={{ fontFamily: "var(--font-cinzel)", color: "#BC6CFF80", fontSize: "9px", letterSpacing: "0.1em" }}>SİPARİŞ NO</p>
                <p style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8" }}>{orderId}</p>
              </div>
              <div className="text-right">
                <p style={{ fontFamily: "var(--font-cinzel)", color: "#BC6CFF80", fontSize: "9px", letterSpacing: "0.1em" }}>DOĞRULAMA</p>
                <p style={{ fontFamily: "var(--font-cormorant)", color: "#FFB86B" }}>SMS Kodu</p>
              </div>
            </div>
          </div>

          <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF", textAlign: "center", marginBottom: "1rem" }}>
            Telefonunuza gönderilen 6 haneli doğrulama kodunu girin.
          </p>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Doğrulama Kodu"
              value={code}
              onChange={(e) => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(false); }}
              className="w-full px-4 py-4 rounded-sm text-center outline-none"
              style={{
                background: "#0B0F2B",
                border: error ? "2px solid #FF5CA8" : "1px solid #BC6CFF40",
                color: "#E9CFE8",
                fontFamily: "var(--font-fuzzy)",
                fontSize: "1.5rem",
                letterSpacing: "0.5em",
              }}
              maxLength={6}
            />
            {error && <p className="text-center mt-2" style={{ fontFamily: "var(--font-cormorant)", color: "#FF5CA8", fontSize: "0.85rem" }}>Geçerli bir kod girin.</p>}
          </div>

          <button onClick={handleVerify} className="w-full py-4 rounded-sm mb-4" style={{ background: "linear-gradient(135deg, #FF5CA8, #BC6CFF)", color: "#fff", fontFamily: "var(--font-cinzel)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", border: "1px solid #FF5CA860", boxShadow: "0 4px 20px #FF5CA830", cursor: "pointer" }}>
            ✓ Ödemeyi Onayla
          </button>

          <div className="text-center">
            {countdown > 0 ? (
              <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF80", fontSize: "0.85rem" }}>
                Kod tekrar gönderilebilir: <span style={{ color: "#FFB86B" }}>{countdown}s</span>
              </p>
            ) : (
              <button
                onClick={() => { setCountdown(59); setResending(true); setTimeout(() => setResending(false), 2000); }}
                style={{ fontFamily: "var(--font-cormorant)", color: "#00F0FF", fontSize: "0.85rem", textDecoration: "underline" }}
              >
                {resending ? "Kod gönderildi!" : "Kodu Tekrar Gönder"}
              </button>
            )}
          </div>
        </div>

        <p className="text-center mt-4" style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF40", fontSize: "0.8rem" }}>
          Bu sayfayı kapatmayın. Doğrulama tamamlanana kadar bekleyin.
        </p>
      </div>
    </main>
  );
}

export default function DogrulamaPage() {
  return (
    <Suspense fallback={
      <main style={{ background: "#0B0F2B", minHeight: "100vh" }} className="flex items-center justify-center">
        <div className="w-12 h-12 rounded-full animate-spin" style={{ border: "2px solid #FF5CA830", borderTopColor: "#FF5CA8" }} />
      </main>
    }>
      <DogrulamaContent />
    </Suspense>
  );
}
