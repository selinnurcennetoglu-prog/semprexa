"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthChange } from "../lib/auth";
import { supabase } from "../lib/supabase";
import { LilySmall } from "../components/Decorations";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const paintSplashBg = `
  radial-gradient(ellipse 500px 500px at 8% 15%, #FF5CA820 0%, transparent 70%),
  radial-gradient(ellipse 400px 400px at 92% 25%, #00F0FF18 0%, transparent 70%),
  radial-gradient(ellipse 600px 350px at 50% 5%, #BC6CFF15 0%, transparent 70%),
  radial-gradient(ellipse 350px 500px at 20% 85%, #FFB86B12 0%, transparent 70%),
  linear-gradient(180deg, #0B0F2B 0%, #0d1130 50%, #080c20 100%)
`;

export default function SepetPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<boolean>(false);

  useEffect(() => {
    const unsub = onAuthChange((u) => { setUser(!!u); });
    loadCart();
    return () => { unsub.then(fn => fn()); };
  }, []);

  const loadCart = () => {
    try {
      setCart(JSON.parse(localStorage.getItem("semprexa_cart") || "[]"));
    } catch { setCart([]); }
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty < 1) return removeFromCart(productId);
    const updated = cart.map(i => i.productId === productId ? { ...i, quantity: qty } : i);
    setCart(updated);
    localStorage.setItem("semprexa_cart", JSON.stringify(updated));
  };

  const removeFromCart = (productId: string) => {
    const updated = cart.filter(i => i.productId !== productId);
    setCart(updated);
    localStorage.setItem("semprexa_cart", JSON.stringify(updated));
  };

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const handleCheckout = () => {
    if (!user) {
      alert("Sipariş vermek için giriş yapın.");
      router.push("/giris");
      return;
    }
    alert("Siparişiniz alındı! Teşekkürler.");
    localStorage.removeItem("semprexa_cart");
    setCart([]);
    router.push("/urunler");
  };

  return (
    <main style={{ background: paintSplashBg, minHeight: "100vh" }} className="pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "0.5em", textTransform: "uppercase", color: "#00F0FF" }} className="block mb-3 neon-text-cyan">✦ Alışveriş ✦</span>
          <h1 style={{ fontFamily: "var(--font-fuzzy)", fontSize: "2.5rem" }} className="neon-text-pink">Sepetim</h1>
          <div className="royal-divider mt-4"><span style={{ color: "#BC6CFF" }}>◆</span></div>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <LilySmall className="w-20 h-20 mx-auto mb-4 opacity-40" />
            <p style={{ fontFamily: "var(--font-fuzzy)", color: "#BC6CFF", fontSize: "1.2rem" }} className="neon-text-purple">Sepetiniz boş</p>
            <Link href="/urunler" className="inline-block mt-4 px-6 py-3" style={{ border: "1px solid #FF5CA840", fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "0.15em" }}>
              <span className="neon-text-pink">Alışverişe Başla</span>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {cart.map((item) => (
                <div key={item.productId} className="flex items-center gap-4 p-4 rounded-sm" style={{ background: "#111535", border: "1px solid #BC6CFF20" }}>
                  <div className="w-16 h-16 rounded-sm flex items-center justify-center flex-shrink-0" style={{ background: "#1a1040" }}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-sm" />
                    ) : (
                      <LilySmall className="w-8 h-8 opacity-30" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 style={{ fontFamily: "var(--font-fuzzy)", color: "#E9CFE8", fontSize: "1rem" }}>{item.name}</h3>
                    <p style={{ fontFamily: "var(--font-fuzzy)", fontSize: "1rem" }} className="neon-text-pink">₺{item.price.toLocaleString("tr-TR")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.productId, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-sm" style={{ border: "1px solid #BC6CFF30", color: "#E9CFE8" }}>−</button>
                    <span style={{ fontFamily: "var(--font-fuzzy)", color: "#E9CFE8", minWidth: "20px", textAlign: "center" }}>{item.quantity}</span>
                    <button onClick={() => updateQty(item.productId, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-sm" style={{ border: "1px solid #BC6CFF30", color: "#E9CFE8" }}>+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.productId)} className="text-xs" style={{ color: "#FF5CA8" }}>✕</button>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-sm" style={{ background: "#111535", border: "1px solid #FF5CA830" }}>
              <div className="flex items-center justify-between mb-4">
                <span style={{ fontFamily: "var(--font-cinzel)", color: "#E9CFE8", fontSize: "11px", letterSpacing: "0.15em" }}>TOPLAM</span>
                <span style={{ fontFamily: "var(--font-fuzzy)", fontSize: "1.5rem" }} className="neon-text-pink">₺{total.toLocaleString("tr-TR")}</span>
              </div>
              <button onClick={handleCheckout} className="w-full py-4 transition-all hover:translate-y-[-1px]" style={{ background: "linear-gradient(135deg, #FF5CA8, #BC6CFF)", color: "#fff", fontFamily: "var(--font-cinzel)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", border: "1px solid #FF5CA860", boxShadow: "0 4px 20px #FF5CA830, 0 0 30px #BC6CFF20", cursor: "pointer" }}>
                ✦ Siparişi Tamamla ✦
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
