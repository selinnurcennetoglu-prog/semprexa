"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { getProduct, getReviews, sendMessage, type Product, type Review } from "../../lib/db";
import { LilySmall } from "../../components/Decorations";
import { useTheme } from "../../lib/useTheme";

function addToCart(product: Product, selectedSize: string) {
  try {
    const cart = JSON.parse(localStorage.getItem("semprexa_cart") || "[]");
    const existing = cart.find((i: { productId: string; size: string }) => i.productId === product.id && i.size === selectedSize);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ productId: product.id, name: product.name, price: product.price, image: product.image, quantity: 1, size: selectedSize });
    }
    localStorage.setItem("semprexa_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
    alert("Sepete eklendi!");
  } catch {
    alert("Sepete eklenemedi.");
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= rating ? "#FFB86B" : "#BC6CFF30", fontSize: "1rem" }}>★</span>
      ))}
    </div>
  );
}

export default function UrunDetayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { bg } = useTheme();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [showAskModal, setShowAskModal] = useState(false);
  const [askSubject, setAskSubject] = useState("");
  const [askMessage, setAskMessage] = useState("");
  const [askSending, setAskSending] = useState(false);
  const [askSent, setAskSent] = useState(false);

  useEffect(() => {
    getProduct(id).then((p) => {
      setProduct(p);
      if (p && p.sizes && p.sizes.length > 0) setSelectedSize(p.sizes[0]);
      setLoading(false);
    }).catch(() => setLoading(false));
    getReviews(id).then(r => setReviews(r)).catch(() => {});
  }, [id]);

  const handleAskSubmit = async () => {
    if (!askMessage.trim()) return;
    setAskSending(true);
    try {
      const subject = askSubject.trim() || `${product?.name} hakkında soru`;
      await sendMessage(subject, askMessage.trim(), id);
      setAskSent(true);
      setTimeout(() => { setShowAskModal(false); setAskSent(false); setAskSubject(""); setAskMessage(""); }, 2000);
    } catch {
      alert("Mesaj gönderilemedi. Lütfen giriş yapın.");
    }
    setAskSending(false);
  };

  if (loading) {
    return (
      <main style={{ background: bg, minHeight: "100vh" }} className="pt-24 pb-16 px-6 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full animate-spin" style={{ border: "2px solid #BC6CFF30", borderTopColor: "#FF5CA8" }} />
      </main>
    );
  }

  if (!product) {
    return (
      <main style={{ background: bg, minHeight: "100vh" }} className="pt-24 pb-16 px-6 flex flex-col items-center justify-center">
        <LilySmall className="w-20 h-20 opacity-40 mb-4" />
        <h1 style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8", fontSize: "1.5rem" }} className="neon-text-pink">Ürün bulunamadı</h1>
        <Link href="/urunler" className="mt-4" style={{ fontFamily: "var(--font-cinzel)", color: "#00F0FF", fontSize: "11px", letterSpacing: "0.15em" }}>← Ürünler</Link>
      </main>
    );
  }

  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const hasSizes = product.sizes && product.sizes.length > 0;

  return (
    <main style={{ background: bg, minHeight: "100vh" }} className="pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/urunler" className="inline-block mb-8" style={{ fontFamily: "var(--font-cinzel)", color: "#00F0FF", fontSize: "10px", letterSpacing: "0.15em" }}>← Ürünlere Dön</Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-sm overflow-hidden" style={{ background: "linear-gradient(135deg, #111535, #1a1040)", border: "1px solid #BC6CFF25" }}>
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-80 object-cover" />
            ) : (
              <div className="h-80 flex items-center justify-center">
                <LilySmall className="w-32 h-32 opacity-30" />
              </div>
            )}
          </div>

          <div>
            <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#00F0FF" }}>{product.category}</span>

            <h1 style={{ fontFamily: "var(--font-fuzzy)", fontSize: "2rem", color: "#E9CFE8", marginTop: "8px" }}>{product.name}</h1>

            {reviews.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <StarRating rating={Math.round(avgRating)} />
                <span style={{ fontFamily: "var(--font-cormorant)", color: "#FFB86B", fontSize: "0.85rem" }}>{avgRating.toFixed(1)}</span>
                <span style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF60", fontSize: "0.8rem" }}>({reviews.length} yorum)</span>
              </div>
            )}

            <p style={{ fontFamily: "var(--font-fuzzy)", fontSize: "1.8rem", marginTop: "16px" }} className="neon-text-pink">₺{product.price.toLocaleString("tr-TR")}</p>

            <div className="my-6" style={{ height: "1px", background: "linear-gradient(to right, #BC6CFF40, transparent)" }} />

            <p style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", lineHeight: 1.7 }}>{product.description || "Açıklama bulunmuyor."}</p>

            {hasSizes && (
              <div className="mt-6">
                <p style={{ fontFamily: "var(--font-cinzel)", color: "#BC6CFF", fontSize: "10px", letterSpacing: "0.15em", marginBottom: "8px" }}>BEDEN SEÇİN</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button key={size} onClick={() => setSelectedSize(size)} className="px-4 py-2 rounded-sm text-[11px] transition-all" style={{
                      fontFamily: "var(--font-cinzel)", letterSpacing: "0.05em",
                      background: selectedSize === size ? "linear-gradient(135deg, #FF5CA8, #BC6CFF)" : "#0d1130",
                      border: selectedSize === size ? "1px solid #FF5CA860" : "1px solid #BC6CFF30",
                      color: selectedSize === size ? "#fff" : "#BC6CFF",
                      cursor: "pointer",
                    }}>{size}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center gap-4">
              <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "0.15em", color: product.stock > 0 ? "#00F0FF" : "#FF5CA8" }}>
                {product.stock > 0 ? `✓ Stokta (${product.stock} adet)` : "✗ Tükendi"}
              </span>
            </div>

            {product.stock > 0 && (
              <button onClick={() => addToCart(product, selectedSize)} className="mt-8 w-full py-4 transition-all hover:translate-y-[-1px]" style={{ background: "linear-gradient(135deg, #FF5CA8, #BC6CFF)", color: "#fff", fontFamily: "var(--font-cinzel)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", border: "1px solid #FF5CA860", boxShadow: "0 4px 20px #FF5CA830, 0 0 30px #BC6CFF20", cursor: "pointer" }}>
                ✦ Sepete Ekle ✦
              </button>
            )}
          </div>
        </div>

        {/* YORUMLAR */}
        {reviews.length > 0 && (
          <div className="mt-16">
            <h2 style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8", fontSize: "1.5rem" }} className="mb-6 neon-text-pink">Müşteri Yorumları</h2>
            <div className="space-y-4">
              {reviews.map(r => (
                <div key={r.id} className="p-5 rounded-sm" style={{ background: "#111535", border: "1px solid #BC6CFF20" }}>
                  <div className="flex items-center justify-between mb-2">
                    <StarRating rating={r.rating} />
                    <span style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF60", fontSize: "0.8rem" }}>{new Date(r.created_at).toLocaleDateString("tr-TR")}</span>
                  </div>
                  {r.comment && <p style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", lineHeight: 1.6 }}>{r.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SATICIYA SOR BUTONU */}
        <div className="mt-12 text-center">
          <button onClick={() => setShowAskModal(true)} className="inline-block px-8 py-4 rounded-sm transition-all hover:translate-y-[-1px]" style={{ border: "1px solid #00F0FF40", color: "#00F0FF", fontFamily: "var(--font-cinzel)", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", background: "#00F0FF08", cursor: "pointer" }}>
            ✉ Satıcıya Sor
          </button>
        </div>
      </div>

      {/* SATICIYA SOR MODAL */}
      {showAskModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4" style={{ background: "#0B0F2Bf0", backdropFilter: "blur(8px)" }} onClick={() => { setShowAskModal(false); setAskSent(false); }}>
          <div className="w-full max-w-md p-6 rounded-sm" style={{ background: "#111535", border: "1px solid #00F0FF30" }} onClick={(e) => e.stopPropagation()}>
            {askSent ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "#00F0FF15", border: "2px solid #00F0FF30" }}>
                  <span style={{ fontSize: "1.8rem" }}>&#10003;</span>
                </div>
                <h3 style={{ fontFamily: "var(--font-fuzzy)", color: "#00F0FF", fontSize: "1.3rem" }} className="neon-text-cyan">Mesajınız Gönderildi!</h3>
                <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF", marginTop: "8px" }}>En kısa sürede size geri dönüş yapılacaktır.</p>
              </div>
            ) : (
              <>
                <h3 style={{ fontFamily: "var(--font-fuzzy)", color: "#00F0FF", fontSize: "1.2rem" }} className="mb-4 neon-text-cyan">✉ Satıcıya Sor</h3>
                <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF", fontSize: "0.85rem", marginBottom: "16px" }}>
                  <strong style={{ color: "#E9CFE8" }}>{product?.name}</strong> hakkında sorunuzu yazın.
                </p>
                <div className="space-y-3">
                  <input type="text" placeholder="Konu (isteğe bağlı)" value={askSubject} onChange={(e) => setAskSubject(e.target.value)} maxLength={200}
                    className="w-full px-4 py-3 rounded-sm outline-none" style={{ background: "#0d1130", border: "1px solid #BC6CFF30", color: "#E9CFE8", fontFamily: "var(--font-cormorant)" }} />
                  <textarea placeholder="Mesajınız..." value={askMessage} onChange={(e) => setAskMessage(e.target.value)} rows={5} maxLength={2000}
                    className="w-full px-4 py-3 rounded-sm outline-none resize-none" style={{ background: "#0d1130", border: "1px solid #BC6CFF30", color: "#E9CFE8", fontFamily: "var(--font-cormorant)" }} />
                  <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF60", fontSize: "0.75rem", textAlign: "right" }}>{askMessage.length}/2000</p>
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={() => { setShowAskModal(false); setAskSent(false); }} className="flex-1 py-3 rounded-sm" style={{ border: "1px solid #BC6CFF40", color: "#BC6CFF", fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "0.15em", cursor: "pointer" }}>İPTAL</button>
                  <button onClick={handleAskSubmit} disabled={askSending || !askMessage.trim()} className="flex-1 py-3 rounded-sm" style={{ background: askMessage.trim() ? "linear-gradient(135deg, #00F0FF, #BC6CFF)" : "#111535", color: askMessage.trim() ? "#fff" : "#BC6CFF60", fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "0.15em", border: "1px solid #00F0FF40", cursor: askMessage.trim() ? "pointer" : "default", opacity: askSending ? 0.7 : 1 }}>
                    {askSending ? "Gönderiliyor..." : "Gönder"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
