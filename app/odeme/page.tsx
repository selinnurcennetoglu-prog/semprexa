"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthChange, getAccessToken } from "../lib/auth";
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
  linear-gradient(180deg, #0B0F2B 0%, #0d1130 50%, #080c20 100%)
`;

function formatCardNumber(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 16);
  return d.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 4);
  if (d.length >= 3) return d.slice(0, 2) + " / " + d.slice(2);
  return d;
}

function getBankName(bin: string): string {
  const banks: Record<string, string> = {
    "4": "Visa",
    "5": "Mastercard",
    "6": "Troy",
    "34": "Amex",
  };
  if (bin.startsWith("9792")) return "Ziraat Bankası";
  if (bin.startsWith("4")) return "Garanti BBVA";
  if (bin.startsWith("5")) return "İş Bankası";
  if (bin.startsWith("6")) return "QNB Finansbank";
  return "Banka";
}

export default function OdemePage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [address, setAddress] = useState({
    fullName: "", phone: "", city: "", district: "", neighborhood: "", fullAddress: "",
  });

  const [card, setCard] = useState({
    name: "", number: "", expiry: "", cvv: "",
  });

  const [cardFlipped, setCardFlipped] = useState(false);
  const [bankName, setBankName] = useState("");
  const [cardType, setCardType] = useState("");

  useEffect(() => {
    const unsub = onAuthChange((u) => {
      if (!u) { router.push("/giris"); return; }
      setLoggedIn(true);
    });
    const stored = localStorage.getItem("semprexa_cart");
    if (stored) {
      try { setCart(JSON.parse(stored)); } catch { setCart([]); }
    }
    setLoading(false);
    return () => { unsub.then((fn) => fn()); };
  }, [router]);

  useEffect(() => {
    const bin = card.number.replace(/\s/g, "").slice(0, 4);
    if (bin.length >= 2) {
      setBankName(getBankName(bin));
      const first = bin[0];
      if (first === "4") setCardType("visa");
      else if (first === "5") setCardType("mastercard");
      else if (first === "6") setCardType("troy");
      else setCardType("");
    } else {
      setBankName("");
      setCardType("");
    }
  }, [card.number]);

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 300 ? 0 : 29.99;
  const total = subtotal + shipping;

  const handlePayment = async () => {
    if (!address.fullName || !address.phone || !address.city || !address.district || !address.neighborhood || !address.fullAddress) {
      alert("Lutfen tum adres bilgilerini doldurun.");
      return;
    }
    if (card.number.replace(/\s/g, "").length < 16) {
      alert("Gecerli bir kart numarasi girin.");
      return;
    }
    if (card.expiry.replace(/\D/g, "").length < 4) {
      alert("Gecerli bir son kullanma tarihi girin.");
      return;
    }
    if (card.cvv.length < 3) {
      alert("Gecerli bir CVV girin.");
      return;
    }
    if (!card.name) {
      alert("Kart uzerindeki ismi girin.");
      return;
    }

    setProcessing(true);

    try {
      const token = getAccessToken();
      if (!token) {
        alert("Oturumunuz suresi dolmus. Lutfen tekrar giris yapin.");
        setProcessing(false);
        return;
      }

      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "createOrder",
          items: cart,
          address,
          total,
          paymentMethod: bankName || "credit_card",
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success || !orderData.orderId) {
        alert("Siparis olusturulamadi. Lutfen tekrar deneyin.");
        setProcessing(false);
        return;
      }

      const maskedCard = "****" + card.number.replace(/\s/g, "").slice(-4);
      sessionStorage.setItem("semprexa_order", JSON.stringify({
        orderId: orderData.orderId,
        orderCode: orderData.orderCode,
        maskedCard,
        bankName,
        total,
        cart,
        address,
      }));

      await new Promise((r) => setTimeout(r, 1000));

      if (card.cvv === "000" || card.number.replace(/\s/g, "").endsWith("0000")) {
        router.push("/odeme/dogrulama?status=fail&orderId=" + orderData.orderId + "&orderCode=" + encodeURIComponent(orderData.orderCode));
      } else {
        router.push("/odeme/dogrulama?status=ok&orderId=" + orderData.orderId + "&orderCode=" + encodeURIComponent(orderData.orderCode) + "&bank=" + encodeURIComponent(bankName));
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Odeme sirasinda bir hata olustu.");
      setProcessing(false);
    }
  };

  if (!loggedIn || loading) {
    return (
      <main style={{ background: paintSplashBg, minHeight: "100vh" }} className="flex items-center justify-center">
        <div className="w-12 h-12 rounded-full animate-spin" style={{ border: "2px solid #FF5CA830", borderTopColor: "#FF5CA8" }} />
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main style={{ background: paintSplashBg, minHeight: "100vh" }} className="pt-24 pb-16 px-6">
        <div className="max-w-2xl mx-auto text-center py-16">
          <LilySmall className="w-16 h-16 mx-auto mb-4 opacity-40" />
          <p style={{ fontFamily: "var(--font-fuzzy)", color: "#BC6CFF", fontSize: "1.2rem" }}>Sepetiniz boş</p>
          <Link href="/urunler" className="inline-block mt-4 px-6 py-3" style={{ border: "1px solid #FF5CA840", fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "0.15em" }}>
            <span className="neon-text-pink">Alışverişe Başla</span>
          </Link>
        </div>
      </main>
    );
  }

  const turkishCities = ["Adana","Adıyaman","Afyonkarahisar","Ağrı","Aksaray","Amasya","Ankara","Antalya","Ardahan","Artvin","Aydın","Balıkesir","Bartın","Batman","Bayburt","Bilecik","Bingöl","Bitlis","Bolu","Burdur","Bursa","Çanakkale","Çankırı","Çorum","Denizli","Diyarbakır","Düzce","Edirne","Elazığ","Erzincan","Erzurum","Eskişehir","Gaziantep","Giresun","Gümüşhane","Hakkari","Hatay","Iğdır","Isparta","İstanbul","İzmir","Kahramanmaraş","Karabük","Karaman","Kars","Kastamonu","Kayseri","Kırıkkale","Kırklareli","Kırşehir","Kilis","Kocaeli","Konya","Kütahya","Malatya","Manisa","Mardin","Mersin","Muğla","Muş","Nevşehir","Niğde","Ordu","Osmaniye","Rize","Sakarya","Samsun","Şanlıurfa","Siirt","Sinop","Sivas","Şırnak","Tekirdağ","Tokat","Trabzon","Tunceli","Uşak","Van","Yalova","Yozgat","Zonguldak"];

  return (
    <main style={{ background: paintSplashBg, minHeight: "100vh" }} className="pt-24 pb-16 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 style={{ fontFamily: "var(--font-fuzzy)", fontSize: "2rem" }} className="neon-text-pink">Ödeme</h1>
          <div className="royal-divider mt-3"><span style={{ color: "#00F0FF" }}>✦</span></div>
        </div>

        <div className="flex gap-1 mb-6 justify-center">
          {["Sipariş Özeti", "Adres", "Ödeme"].map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{
                fontFamily: "var(--font-cinzel)",
                background: "linear-gradient(135deg, #FF5CA8, #BC6CFF)",
                color: "#fff",
              }}>{i + 1}</span>
              <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "10px", color: "#BC6CFF", letterSpacing: "0.1em" }}>{s}</span>
              {i < 2 && <span className="mx-1" style={{ color: "#BC6CFF40" }}>→</span>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">

            <div className="p-6 rounded-sm" style={{ background: "#111535", border: "1px solid #BC6CFF20" }}>
              <h2 style={{ fontFamily: "var(--font-fuzzy)", color: "#00F0FF", fontSize: "1.1rem" }} className="mb-4 neon-text-cyan">✦ Teslimat Adresi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input placeholder="Ad Soyad" value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} className="px-4 py-3 rounded-sm outline-none" style={{ background: "#0d1130", border: "1px solid #BC6CFF30", color: "#E9CFE8", fontFamily: "var(--font-cormorant)", fontSize: "0.95rem" }} />
                <input placeholder="Telefon (+90 5XX XXX XX XX)" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className="px-4 py-3 rounded-sm outline-none" style={{ background: "#0d1130", border: "1px solid #BC6CFF30", color: "#E9CFE8", fontFamily: "var(--font-cormorant)", fontSize: "0.95rem" }} />
                <select value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="px-4 py-3 rounded-sm outline-none" style={{ background: "#0d1130", border: "1px solid #BC6CFF30", color: address.city ? "#E9CFE8" : "#BC6CFF80", fontFamily: "var(--font-cormorant)", fontSize: "0.95rem" }}>
                  <option value="">İl Seçin</option>
                  {turkishCities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <input placeholder="İlçe" value={address.district} onChange={(e) => setAddress({ ...address, district: e.target.value })} className="px-4 py-3 rounded-sm outline-none" style={{ background: "#0d1130", border: "1px solid #BC6CFF30", color: "#E9CFE8", fontFamily: "var(--font-cormorant)", fontSize: "0.95rem" }} />
                <input placeholder="Mahalle / Köy" value={address.neighborhood} onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })} className="px-4 py-3 rounded-sm outline-none" style={{ background: "#0d1130", border: "1px solid #BC6CFF30", color: "#E9CFE8", fontFamily: "var(--font-cormorant)", fontSize: "0.95rem" }} />
                <input placeholder="Açık Adres (Cadde, Sokak, Bina No)" value={address.fullAddress} onChange={(e) => setAddress({ ...address, fullAddress: e.target.value })} className="px-4 py-3 rounded-sm outline-none md:col-span-2" style={{ background: "#0d1130", border: "1px solid #BC6CFF30", color: "#E9CFE8", fontFamily: "var(--font-cormorant)", fontSize: "0.95rem" }} />
              </div>
            </div>

            <div className="p-6 rounded-sm" style={{ background: "#111535", border: "1px solid #BC6CFF20" }}>
              <h2 style={{ fontFamily: "var(--font-fuzzy)", color: "#00F0FF", fontSize: "1.1rem" }} className="mb-4 neon-text-cyan">✦ Kart Bilgileri</h2>

              <div className="mb-6 perspective-1000" style={{ perspective: "1000px" }}>
                <div className="relative w-full max-w-sm mx-auto h-52 transition-transform duration-500" style={{ transformStyle: "preserve-3d", transform: cardFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>
                  <div className="absolute inset-0 rounded-xl p-6 flex flex-col justify-between" style={{ backfaceVisibility: "hidden", background: "linear-gradient(135deg, #1a1040 0%, #2d1570 50%, #0d1130 100%)", border: "1px solid #BC6CFF40", boxShadow: "0 10px 40px #00000060, 0 0 20px #BC6CFF15" }}>
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-8 rounded" style={{ background: "linear-gradient(135deg, #FFB86B, #FF5CA8)" }} />
                      <div className="flex gap-1">
                        {cardType === "visa" && <span style={{ fontFamily: "var(--font-cinzel)", color: "#FFB86B", fontSize: "14px", fontWeight: 700 }}>VISA</span>}
                        {cardType === "mastercard" && <span style={{ fontFamily: "var(--font-cinzel)", color: "#FF5CA8", fontSize: "12px", fontWeight: 700 }}>MASTERCARD</span>}
                        {cardType === "troy" && <span style={{ fontFamily: "var(--font-cinzel)", color: "#00F0FF", fontSize: "12px", fontWeight: 700 }}>TROY</span>}
                      </div>
                    </div>
                    <div>
                      <p style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", fontSize: "1.2rem", letterSpacing: "0.2em" }}>{card.number || "•••• •••• •••• ••••"}</p>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p style={{ fontFamily: "var(--font-cinzel)", color: "#BC6CFF80", fontSize: "8px", letterSpacing: "0.1em" }}>KART SAHİBİ</p>
                        <p style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", fontSize: "0.9rem" }}>{card.name || "AD SOYAD"}</p>
                      </div>
                      <div>
                        <p style={{ fontFamily: "var(--font-cinzel)", color: "#BC6CFF80", fontSize: "8px", letterSpacing: "0.1em" }}>SKT</p>
                        <p style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", fontSize: "0.9rem" }}>{card.expiry || "AA/YY"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-xl p-6 flex flex-col justify-between" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "linear-gradient(135deg, #2d1570 0%, #1a1040 100%)", border: "1px solid #BC6CFF40" }}>
                    <div className="w-full h-12 rounded" style={{ background: "#000" }} />
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-10 rounded flex items-center justify-end px-4" style={{ background: "#0d1130", border: "1px solid #BC6CFF30" }}>
                        <p style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", fontSize: "1.1rem" }}>{card.cvv || "•••"}</p>
                      </div>
                      <p style={{ fontFamily: "var(--font-cinzel)", color: "#BC6CFF80", fontSize: "9px" }}>CVV</p>
                    </div>
                    <div />
                  </div>
                </div>
              </div>

              {bankName && <p className="text-center mb-4" style={{ fontFamily: "var(--font-cormorant)", color: "#FFB86B", fontSize: "0.85rem" }}>🏦 {bankName}</p>}

              <div className="space-y-3">
                <input placeholder="Kart Üzerindeki İsim" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value.toUpperCase() })} className="w-full px-4 py-3 rounded-sm outline-none" style={{ background: "#0d1130", border: "1px solid #BC6CFF30", color: "#E9CFE8", fontFamily: "var(--font-cormorant)", fontSize: "0.95rem" }} />
                <input placeholder="Kart Numarası" value={card.number} onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })} maxLength={19} className="w-full px-4 py-3 rounded-sm outline-none" style={{ background: "#0d1130", border: "1px solid #BC6CFF30", color: "#E9CFE8", fontFamily: "var(--font-cormorant)", fontSize: "0.95rem", letterSpacing: "0.15em" }} />
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="AA/YY" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })} maxLength={7} className="px-4 py-3 rounded-sm outline-none" style={{ background: "#0d1130", border: "1px solid #BC6CFF30", color: "#E9CFE8", fontFamily: "var(--font-cormorant)", fontSize: "0.95rem" }} />
                  <input placeholder="CVV" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })} onFocus={() => setCardFlipped(true)} onBlur={() => setCardFlipped(false)} maxLength={4} className="px-4 py-3 rounded-sm outline-none" style={{ background: "#0d1130", border: "1px solid #BC6CFF30", color: "#E9CFE8", fontFamily: "var(--font-cormorant)", fontSize: "0.95rem" }} />
                </div>
              </div>

              <p className="mt-4 text-center" style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF60", fontSize: "0.8rem" }}>
                🔒 3D Secure ile güvenli ödeme
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="p-6 rounded-sm sticky top-24" style={{ background: "#111535", border: "1px solid #FF5CA830" }}>
              <h2 style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8", fontSize: "1.1rem" }} className="mb-4 neon-text-pink">Sipariş Özeti</h2>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#BC6CFF40 transparent" }}>
                {cart.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3 pb-3" style={{ borderBottom: "1px solid #BC6CFF15" }}>
                    <div className="w-12 h-12 rounded-sm flex-shrink-0 flex items-center justify-center" style={{ background: "#1a1040" }}>
                      {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-sm" /> : <LilySmall className="w-6 h-6 opacity-30" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", fontSize: "0.85rem" }} className="truncate">{item.name}</p>
                      <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF" }}>x{item.quantity}</p>
                    </div>
                    <p style={{ fontFamily: "var(--font-cormorant)", color: "#FF5CA8" }}>₺{(item.price * item.quantity).toLocaleString("tr-TR")}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-2" style={{ borderTop: "1px solid #BC6CFF20" }}>
                <div className="flex justify-between">
                  <span style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF" }}>Ara Toplam</span>
                  <span style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8" }}>₺{subtotal.toLocaleString("tr-TR")}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF" }}>Kargo</span>
                  <span style={{ fontFamily: "var(--font-cormorant)", color: shipping === 0 ? "#00F0FF" : "#E9CFE8" }}>{shipping === 0 ? "Ücretsiz" : "₺" + shipping.toLocaleString("tr-TR")}</span>
                </div>
                {shipping > 0 && <p style={{ fontFamily: "var(--font-cormorant)", color: "#00F0FF", fontSize: "0.75rem" }}>300₺ ve üzeri alışverişlerde kargo ücretsiz!</p>}
                <div className="flex justify-between pt-3" style={{ borderTop: "1px solid #BC6CFF30" }}>
                  <span style={{ fontFamily: "var(--font-fuzzy)", color: "#E9CFE8", fontSize: "1rem" }}>Toplam</span>
                  <span style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8", fontSize: "1.3rem" }} className="neon-text-pink">₺{total.toLocaleString("tr-TR")}</span>
                </div>
              </div>

              <button onClick={handlePayment} disabled={processing} className="w-full mt-6 py-4 rounded-sm transition-all hover:translate-y-[-1px]" style={{ background: "linear-gradient(135deg, #FF5CA8, #BC6CFF)", color: "#fff", fontFamily: "var(--font-cinzel)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", border: "1px solid #FF5CA860", boxShadow: "0 4px 20px #FF5CA830, 0 0 30px #BC6CFF20", cursor: processing ? "wait" : "pointer", opacity: processing ? 0.7 : 1 }}>
                {processing ? "⏳ İşleniyor..." : "✦ Ödemeyi Tamamla ✦"}
              </button>

              <Link href="/sepet" className="block text-center mt-3" style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF", fontSize: "0.85rem" }}>
                ← Sepete Dön
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
