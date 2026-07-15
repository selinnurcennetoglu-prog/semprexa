"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { LilySmall } from "../components/Decorations";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function SepetPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<boolean>(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => { setUser(!!u); });
    loadCart();
    return () => unsub();
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
    <main style={{ background: "#191B37", minHeight: "100vh" }} className="pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "0.5em", textTransform: "uppercase", color: "#872D72" }} className="block mb-3">✦ Alışveriş ✦</span>
          <h1 style={{ fontFamily: "var(--font-yuyu)", fontSize: "2.5rem", color: "#E21C70" }}>Sepetim</h1>
          <div className="royal-divider mt-4"><span style={{ color: "#7C4EBB" }}>◆</span></div>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <LilySmall className="w-20 h-20 mx-auto mb-4 opacity-40" />
            <p style={{ fontFamily: "var(--font-fuzzy)", color: "#872D72", fontSize: "1.2rem" }}>Sepetiniz boş</p>
            <Link href="/urunler" className="inline-block mt-4 px-6 py-3" style={{ border: "1px solid #E21C7040", color: "#E21C70", fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "0.15em" }}>
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {cart.map((item) => (
                <div key={item.productId} className="flex items-center gap-4 p-4 rounded-sm" style={{ background: "#1f1d3a", border: "1px solid #7C4EBB20" }}>
                  <div className="w-16 h-16 rounded-sm flex items-center justify-center flex-shrink-0" style={{ background: "#411E57" }}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-sm" />
                    ) : (
                      <LilySmall className="w-8 h-8 opacity-30" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 style={{ fontFamily: "var(--font-yuyu)", color: "#E9CFE8", fontSize: "1rem" }}>{item.name}</h3>
                    <p style={{ fontFamily: "var(--font-fuzzy)", color: "#E21C70", fontSize: "1rem" }}>₺{item.price.toLocaleString("tr-TR")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.productId, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-sm" style={{ border: "1px solid #7C4EBB30", color: "#EDABBE" }}>−</button>
                    <span style={{ fontFamily: "var(--font-fuzzy)", color: "#E9CFE8", minWidth: "20px", textAlign: "center" }}>{item.quantity}</span>
                    <button onClick={() => updateQty(item.productId, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-sm" style={{ border: "1px solid #7C4EBB30", color: "#EDABBE" }}>+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.productId)} className="text-xs" style={{ color: "#AE0849" }}>✕</button>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-sm" style={{ background: "#1f1d3a", border: "1px solid #E21C7030" }}>
              <div className="flex items-center justify-between mb-4">
                <span style={{ fontFamily: "var(--font-cinzel)", color: "#EDABBE", fontSize: "11px", letterSpacing: "0.15em" }}>TOPLAM</span>
                <span style={{ fontFamily: "var(--font-fuzzy)", color: "#E21C70", fontSize: "1.5rem" }}>₺{total.toLocaleString("tr-TR")}</span>
              </div>
              <button onClick={handleCheckout} className="w-full py-4 transition-all hover:translate-y-[-1px]" style={{ background: "linear-gradient(135deg, #E21C70, #872D72)", color: "#fff", fontFamily: "var(--font-cinzel)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", border: "1px solid #E21C7060", boxShadow: "0 4px 20px #E21C7030", cursor: "pointer" }}>
                ✦ Siparişi Tamamla ✦
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
