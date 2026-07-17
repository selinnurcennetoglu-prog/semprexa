"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthChange, type UserProfile } from "../lib/auth";
import { useTheme } from "../lib/useTheme";
import { LilySmall } from "../components/Decorations";

interface Order {
  id: string;
  order_code: string;
  items: string;
  total: number;
  status: string;
  cargo_company: string;
  cargo_tracking: string;
  cargo_status: string;
  created_at: string;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Beklemede", color: "#FFB86B" },
  processing: { label: "Hazırlanıyor", color: "#00F0FF" },
  shipped: { label: "Kargoya Verildi", color: "#BC6CFF" },
  in_transit: { label: "Yolda", color: "#FF5CA8" },
  delivered: { label: "Teslim Edildi", color: "#52b788" },
  cancelled: { label: "İptal", color: "#e63946" },
};

export default function DashboardPage() {
  const router = useRouter();
  const { bg } = useTheme();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange((u) => {
      if (!u) { router.push("/giris"); return; }
      setUser(u);
      setLoading(false);
    });
    return () => { unsub.then((fn) => fn()); };
  }, [router]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("semprexa_session") ? JSON.parse(localStorage.getItem("semprexa_session")!).access_token : ""}` },
      body: JSON.stringify({ action: "getOrders", role: user.role }),
    })
      .then(r => r.json())
      .then(json => { setOrders(json.data || []); setOrdersLoading(false); })
      .catch(() => setOrdersLoading(false));
  }, [user]);

  if (loading) {
    return (
      <main style={{ background: bg, minHeight: "100vh" }} className="flex items-center justify-center">
        <div className="w-12 h-12 rounded-full animate-spin" style={{ border: "2px solid #BC6CFF30", borderTopColor: "#FF5CA8" }} />
      </main>
    );
  }

  const totalSpent = orders.reduce((s, o) => s + (o.total || 0), 0);
  const deliveredCount = orders.filter(o => o.status === "delivered").length;

  return (
    <main style={{ background: bg, minHeight: "100vh" }} className="pt-24 pb-16 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <LilySmall className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <h1 style={{ fontFamily: "var(--font-fuzzy)", fontSize: "2rem" }} className="neon-text-pink">Hesabım</h1>
          <div className="royal-divider mt-3"><span style={{ color: "#00F0FF" }}>✦</span></div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Toplam Sipariş", value: orders.length, color: "#FF5CA8" },
            { label: "Toplam Harcama", value: `₺${totalSpent.toLocaleString("tr-TR")}`, color: "#00F0FF" },
            { label: "Teslim Edilen", value: deliveredCount, color: "#52b788" },
            { label: "Kayıt Tarihi", value: user?.created_at ? new Date(user.created_at).toLocaleDateString("tr-TR") : "-", color: "#BC6CFF" },
          ].map((s, i) => (
            <div key={i} className="p-4 rounded-sm text-center" style={{ background: "#111535", border: "1px solid #BC6CFF20" }}>
              <p style={{ fontFamily: "var(--font-cinzel)", color: "#BC6CFF80", fontSize: "9px", letterSpacing: "0.1em" }}>{s.label.toUpperCase()}</p>
              <p style={{ fontFamily: "var(--font-fuzzy)", color: s.color, fontSize: "1.3rem", marginTop: "4px" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* QUICK LINKS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { href: "/urunler", label: "Ürünler", icon: "🛍️", color: "#FF5CA8" },
            { href: "/sepet", label: "Sepetim", icon: "🛒", color: "#00F0FF" },
            { href: "/kargo-takip", label: "Kargo Takip", icon: "📦", color: "#BC6CFF" },
            { href: "/hesap", label: "Ayarlar", icon: "⚙️", color: "#FFB86B" },
          ].map((l, i) => (
            <Link key={i} href={l.href} className="p-4 rounded-sm text-center transition-all hover:translate-y-[-2px]" style={{ background: "#111535", border: "1px solid #BC6CFF20" }}>
              <span style={{ fontSize: "1.5rem" }}>{l.icon}</span>
              <p style={{ fontFamily: "var(--font-fuzzy)", color: l.color, fontSize: "0.9rem", marginTop: "4px" }}>{l.label}</p>
            </Link>
          ))}
        </div>

        {/* RECENT ORDERS */}
        <div className="p-6 rounded-sm mb-8" style={{ background: "#111535", border: "1px solid #BC6CFF20" }}>
          <h2 style={{ fontFamily: "var(--font-fuzzy)", color: "#00F0FF", fontSize: "1.1rem" }} className="mb-4 neon-text-cyan">Son Siparişlerim</h2>

          {ordersLoading ? (
            <div className="py-8 text-center">
              <div className="w-8 h-8 rounded-full animate-spin mx-auto" style={{ border: "2px solid #BC6CFF30", borderTopColor: "#FF5CA8" }} />
            </div>
          ) : orders.length === 0 ? (
            <div className="py-8 text-center">
              <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF60", fontSize: "1rem" }}>Henüz siparişiniz yok.</p>
              <Link href="/urunler" className="inline-block mt-3 px-6 py-2 rounded-sm" style={{ fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "0.15em", background: "linear-gradient(135deg, #FF5CA8, #BC6CFF)", color: "#fff" }}>
                Alışverişe Başla
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map(order => {
                const st = statusLabels[order.status] || { label: order.status, color: "#BC6CFF" };
                return (
                  <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-sm gap-3" style={{ background: "#0d1130", border: "1px solid #BC6CFF15" }}>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span style={{ fontFamily: "var(--font-fuzzy)", color: "#E9CFE8", fontSize: "0.95rem" }}>{order.order_code}</span>
                        <span className="px-2 py-0.5 rounded-sm text-[10px]" style={{ fontFamily: "var(--font-cinzel)", background: st.color + "20", color: st.color, letterSpacing: "0.05em" }}>{st.label}</span>
                      </div>
                      <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF60", fontSize: "0.85rem" }}>
                        {new Date(order.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p style={{ fontFamily: "var(--font-fuzzy)", color: "#FFB86B", fontSize: "1rem" }}>₺{order.total.toLocaleString("tr-TR")}</p>
                      {order.cargo_tracking && (
                        <Link href="/kargo-takip" style={{ fontFamily: "var(--font-cormorant)", color: "#00F0FF", fontSize: "0.8rem" }}>
                          Kargo Takip →
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* USER INFO */}
        <div className="p-6 rounded-sm mb-6" style={{ background: "#111535", border: "1px solid #BC6CFF20" }}>
          <h2 style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8", fontSize: "1.1rem" }} className="mb-4 neon-text-pink">Kişisel Bilgiler</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Ad Soyad", value: user?.name || "-" },
              { label: "E-posta", value: user?.email || "-" },
              { label: "Telefon", value: user?.phone || "-" },
              { label: "Cinsiyet", value: user?.gender === "erkek" ? "Erkek" : user?.gender === "kadin" ? "Kadın" : "-" },
            ].map((f, i) => (
              <div key={i}>
                <p style={{ fontFamily: "var(--font-cinzel)", color: "#BC6CFF80", fontSize: "9px", letterSpacing: "0.1em" }}>{f.label.toUpperCase()}</p>
                <p style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", marginTop: "4px", fontSize: "0.95rem" }}>{f.value}</p>
              </div>
            ))}
          </div>
          <Link href="/hesap" className="inline-block mt-4 px-5 py-2 rounded-sm text-xs" style={{ fontFamily: "var(--font-cinzel)", letterSpacing: "0.15em", border: "1px solid #BC6CFF40", color: "#BC6CFF" }}>
            Bilgileri Düzenle
          </Link>
        </div>

        <div className="text-center">
          <LilySmall className="w-10 h-10 mx-auto opacity-20" />
        </div>
      </div>
    </main>
  );
}
