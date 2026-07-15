"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { getProduct, type Product } from "../../lib/db";
import { LilySmall } from "../../components/Decorations";

function addToCart(product: Product) {
  try {
    const cart = JSON.parse(localStorage.getItem("semprexa_cart") || "[]");
    const existing = cart.find((i: { productId: string }) => i.productId === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ productId: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 });
    }
    localStorage.setItem("semprexa_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
    alert("Sepete eklendi!");
  } catch {
    alert("Sepete eklenemedi.");
  }
}

export default function UrunDetayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProduct(id).then((p) => { setProduct(p); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main style={{ background: "#191B37", minHeight: "100vh" }} className="pt-24 pb-16 px-6 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full animate-spin" style={{ border: "2px solid #7C4EBB30", borderTopColor: "#E21C70" }} />
      </main>
    );
  }

  if (!product) {
    return (
      <main style={{ background: "#191B37", minHeight: "100vh" }} className="pt-24 pb-16 px-6 flex flex-col items-center justify-center">
        <LilySmall className="w-20 h-20 opacity-40 mb-4" />
        <h1 style={{ fontFamily: "var(--font-yuyu)", color: "#E21C70", fontSize: "1.5rem" }}>Ürün bulunamadı</h1>
        <Link href="/urunler" className="mt-4" style={{ fontFamily: "var(--font-cinzel)", color: "#7C4EBB", fontSize: "11px", letterSpacing: "0.15em" }}>← Ürünler</Link>
      </main>
    );
  }

  return (
    <main style={{ background: "#191B37", minHeight: "100vh" }} className="pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/urunler" className="inline-block mb-8" style={{ fontFamily: "var(--font-cinzel)", color: "#7C4EBB", fontSize: "10px", letterSpacing: "0.15em" }}>← Ürünlere Dön</Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-sm overflow-hidden" style={{ background: "linear-gradient(135deg, #1f1d3a, #411E57)", border: "1px solid #7C4EBB25" }}>
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-80 object-cover" />
            ) : (
              <div className="h-80 flex items-center justify-center">
                <LilySmall className="w-32 h-32 opacity-30" />
              </div>
            )}
          </div>

          <div>
            <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7C4EBB" }}>{product.category}</span>

            <h1 style={{ fontFamily: "var(--font-yuyu)", fontSize: "2rem", color: "#E9CFE8", marginTop: "8px" }}>{product.name}</h1>

            <p style={{ fontFamily: "var(--font-fuzzy)", fontSize: "1.8rem", color: "#E21C70", marginTop: "16px" }}>₺{product.price.toLocaleString("tr-TR")}</p>

            <div className="my-6" style={{ height: "1px", background: "linear-gradient(to right, #7C4EBB40, transparent)" }} />

            <p style={{ fontFamily: "var(--font-cormorant)", color: "#EDABBE", lineHeight: 1.7 }}>{product.description || "Açıklama bulunmuyor."}</p>

            <div className="mt-6 flex items-center gap-4">
              <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "0.15em", color: product.stock > 0 ? "#7C4EBB" : "#AE0849" }}>
                {product.stock > 0 ? `✓ Stokta (${product.stock} adet)` : "✗ Tükendi"}
              </span>
            </div>

            {product.stock > 0 && (
              <button onClick={() => addToCart(product)} className="mt-8 w-full py-4 transition-all hover:translate-y-[-1px]" style={{ background: "linear-gradient(135deg, #E21C70, #872D72)", color: "#fff", fontFamily: "var(--font-cinzel)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", border: "1px solid #E21C7060", boxShadow: "0 4px 20px #E21C7030", cursor: "pointer" }}>
                ✦ Sepete Ekle ✦
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
