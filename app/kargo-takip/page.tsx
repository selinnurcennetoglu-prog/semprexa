"use client";

import { useState } from "react";
import { LilySmall } from "../components/Decorations";

const paintSplashBg = `
  radial-gradient(ellipse 500px 500px at 8% 15%, #FF5CA820 0%, transparent 70%),
  radial-gradient(ellipse 400px 400px at 92% 25%, #00F0FF18 0%, transparent 70%),
  linear-gradient(180deg, #0B0F2B 0%, #0d1130 50%, #080c20 100%)
`;

const statusSteps = [
  { key: "pending", label: "Sipariş Alındı", icon: "📋" },
  { key: "shipped", label: "Kargoya Verildi", icon: "📦" },
  { key: "in_transit", label: "Yolda", icon: "🚚" },
  { key: "delivered", label: "Teslim Edildi", icon: "✅" },
];

interface TrackData {
  order_code: string;
  cargo_company: string;
  cargo_tracking: string;
  cargo_status: string;
  status: string;
  created_at: string;
  total: number;
}

export default function KargoTakipPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TrackData | null>(null);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "trackOrder", orderCode: code.trim().toUpperCase() }),
      });
      const result = await res.json();
      if (result.error) {
        setError(result.error);
      } else {
        setData(result.data);
      }
    } catch {
      setError("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const currentStep = data ? statusSteps.findIndex(s => s.key === data.cargo_status) : -1;

  return (
    <main style={{ background: paintSplashBg, minHeight: "100vh" }} className="pt-24 pb-16 px-4 md:px-6">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 style={{ fontFamily: "var(--font-fuzzy)", fontSize: "2rem" }} className="neon-text-cyan">📦 Kargo Takip</h1>
          <div className="royal-divider mt-3"><span style={{ color: "#00F0FF" }}>✦</span></div>
          <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF" }} className="mt-2">Sipariş kodunuzu girerek kargo durumunu sorgulayın</p>
        </div>

        <div className="p-6 rounded-sm" style={{ background: "#111535", border: "1px solid #BC6CFF20" }}>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Sipariş Kodu (SPR-XXXXXX)"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleTrack()}
              className="flex-1 px-4 py-3 rounded-sm outline-none"
              style={{ background: "#0d1130", border: "1px solid #BC6CFF30", color: "#E9CFE8", fontFamily: "var(--font-fuzzy)", fontSize: "1.1rem", letterSpacing: "0.1em" }}
            />
            <button
              onClick={handleTrack}
              disabled={loading}
              className="px-6 py-3 rounded-sm transition-all hover:translate-y-[-1px]"
              style={{ background: "linear-gradient(135deg, #FF5CA8, #BC6CFF)", color: "#fff", fontFamily: "var(--font-cinzel)", fontSize: "11px", letterSpacing: "0.15em", border: "1px solid #FF5CA860", cursor: loading ? "wait" : "pointer" }}
            >
              {loading ? "..." : "Sorgula"}
            </button>
          </div>

          {error && (
            <p className="mt-4 text-center" style={{ fontFamily: "var(--font-cormorant)", color: "#FF5CA8" }}>{error}</p>
          )}
        </div>

        {data && (
          <div className="mt-6 p-6 rounded-sm" style={{ background: "#111535", border: "1px solid #00F0FF20" }}>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-sm text-[10px] font-bold" style={{ fontFamily: "var(--font-cinzel)", background: "#FF5CA820", color: "#FF5CA8", letterSpacing: "0.1em" }}>{data.order_code}</span>
              <span style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8", fontSize: "1.1rem" }}>₺{Number(data.total).toLocaleString("tr-TR")}</span>
            </div>

            <div className="space-y-2 mb-6" style={{ fontFamily: "var(--font-cormorant)" }}>
              <div className="flex justify-between">
                <span style={{ color: "#BC6CFF" }}>Kargo Firması</span>
                <span style={{ color: "#E9CFE8" }}>{data.cargo_company || "Henüz atanmadı"}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "#BC6CFF" }}>Takip Kodu</span>
                <span style={{ color: data.cargo_tracking ? "#00F0FF" : "#BC6CFF60", fontFamily: data.cargo_tracking ? "var(--font-fuzzy)" : undefined }}>{data.cargo_tracking || "Henüz atanmadı"}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "#BC6CFF" }}>Tarih</span>
                <span style={{ color: "#E9CFE8" }}>{new Date(data.created_at).toLocaleDateString("tr-TR")}</span>
              </div>
            </div>

            {/* Durum adimlari */}
            <div className="pt-4" style={{ borderTop: "1px solid #BC6CFF15" }}>
              <p style={{ fontFamily: "var(--font-cinzel)", color: "#BC6CFF80", fontSize: "9px", letterSpacing: "0.15em", marginBottom: "12px" }}>KARGO DURUMU</p>
              <div className="space-y-3">
                {statusSteps.map((step, i) => {
                  const isActive = i <= currentStep;
                  const isCurrent = i === currentStep;
                  return (
                    <div key={step.key} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{
                        background: isActive ? "linear-gradient(135deg, #00F0FF30, #00F0FF15)" : "#0d1130",
                        border: isCurrent ? "2px solid #00F0FF" : isActive ? "1px solid #00F0FF40" : "1px solid #BC6CFF20",
                        boxShadow: isCurrent ? "0 0 15px #00F0FF30" : "none",
                      }}>
                        <span style={{ fontSize: "0.8rem" }}>{step.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p style={{ fontFamily: "var(--font-cormorant)", color: isActive ? "#E9CFE8" : "#BC6CFF50", fontWeight: isCurrent ? 600 : 400 }}>{step.label}</p>
                      </div>
                      {isActive && <span style={{ fontFamily: "var(--font-cinzel)", color: "#00F0FF", fontSize: "9px" }}>✓</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <LilySmall className="w-10 h-10 mx-auto opacity-20" />
        </div>
      </div>
    </main>
  );
}
