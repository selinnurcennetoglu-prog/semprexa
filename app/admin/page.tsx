"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthChange, logoutUser } from "../lib/auth";
import { getProducts, createProduct, deleteProduct, getUsers, deleteUser, updateUserRole, addReview, getMessages, replyMessage, resolveMessage, searchCustomers, type Product, type Message } from "../lib/db";
import { getAccessToken } from "../lib/auth";
import { LilySmall } from "../components/Decorations";

interface UserProfile { uid: string; name: string; email: string; phone: string; role: string; created_at: string; phone_verified: boolean; }
interface Order { id: string; order_code: string; user_uid: string; items: string; address: string; total: number; status: string; payment_method: string; created_at: string; cargo_company: string; cargo_tracking: string; cargo_status: string; order_note: string; }

function Sparkles() {
  const dots = Array.from({ length: 15 }, (_, i) => ({
    left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, delay: `${Math.random() * 6}s`, size: `${2 + Math.random() * 4}px`,
  }));
  return (<>{dots.map((d, i) => (<div key={i} className="sparkle-dot" style={{ left: d.left, top: d.top, animationDelay: d.delay, width: d.size, height: d.size }} />))}</>);
}

export default function AdminPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<{ uid: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"istatistik" | "urunler" | "kullanicilar" | "urun-ekle" | "siparisler" | "mesajlar" | "reklam" | "musteriler">("istatistik");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerResults, setCustomerResults] = useState<Record<string, unknown>[]>([]);
  const [customerSearching, setCustomerSearching] = useState(false);
  const [replyModal, setReplyModal] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [reviewModal, setReviewModal] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: 0, wholesale_price: 0, category: "Diger", image: "", stock: 10, featured: false, sizes: [] as string[] });

  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      if (!u) { router.push("/admin/giris"); return; }
      if (u.role !== "admin") { router.push("/admin/giris"); return; }
      setAdmin({ uid: u.uid }); setLoading(false);
      loadUsers();
      loadProducts();
    });
    return () => { unsub.then(fn => fn()); };
  }, [router]);

  const loadUsers = async () => { const u = await getUsers(); setUsers(u as unknown as UserProfile[]); };
  const loadProducts = async () => { const p = await getProducts(); setProducts(p); };
  const loadOrders = async () => {
    const token = getAccessToken();
    if (!token) return;
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ action: "getOrders", role: "admin" }),
      });
      const data = await res.json();
      setOrders(data.data || []);
    } catch {}
  };
  const loadMessages = async () => { const m = await getMessages(); setMessages(m); };

  const handleCustomerSearch = async () => {
    if (customerSearch.length < 2) return;
    setCustomerSearching(true);
    try {
      const results = await searchCustomers(customerSearch);
      setCustomerResults(results);
    } catch {}
    setCustomerSearching(false);
  };

  useEffect(() => {
    if (tab === "kullanicilar") loadUsers();
    if (tab === "urunler") loadProducts();
    if (tab === "istatistik") { loadUsers(); loadProducts(); }
    if (tab === "siparisler") loadOrders();
    if (tab === "mesajlar") loadMessages();
  }, [tab]);

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) { alert("Isim ve fiyat gerekli."); return; }
    try {
      await createProduct(newProduct);
      alert("Urun eklendi!");
      setNewProduct({ name: "", description: "", price: 0, wholesale_price: 0, category: "Diger", image: "", stock: 10, featured: false, sizes: [] });
      setTab("urunler");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Hata";
      alert("Urun eklenemedi: " + msg);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Bu urunu silmek istediginize emin misiniz?")) return;
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err: unknown) {
      alert("Silinemedi: " + (err instanceof Error ? err.message : "Hata"));
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (!confirm("Bu kullaniciyi silmek istediginize emin misiniz?")) return;
    await deleteUser(uid);
    setUsers(prev => prev.filter(u => u.uid !== uid));
  };

  const handleToggleRole = async (uid: string, role: string) => {
    const newRole = role === "admin" ? "user" : "admin";
    await updateUserRole(uid, newRole);
    setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role: newRole } : u));
  };

  const handleAddReview = async (productId: string) => {
    try {
      await addReview(productId, admin!.uid, reviewRating, reviewComment);
      alert("Yorum eklendi!");
      setReviewModal(null);
      setReviewComment("");
      setReviewRating(5);
    } catch (err: unknown) {
      alert("Yorum eklenemedi: " + (err instanceof Error ? err.message : "Hata"));
    }
  };

  const handleUpdateCargo = async (orderId: string, cargoCompany: string, cargoTracking: string, cargoStatus: string, orderStatus: string) => {
    const token = getAccessToken();
    if (!token) return;
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ action: "updateCargo", orderId, cargoCompany, cargoTracking, cargoStatus, orderStatus }),
      });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, cargo_company: cargoCompany, cargo_tracking: cargoTracking, cargo_status: cargoStatus, status: orderStatus } : o));
    } catch {}
  };

  const handleReply = async (messageId: string) => {
    if (!replyText.trim()) return;
    try {
      await replyMessage(messageId, replyText.trim());
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, reply: replyText.trim(), status: "replied" } : m));
      setReplyModal(null);
      setReplyText("");
    } catch { alert("Yanit gonderilemedi."); }
  };

  const handleResolve = async (messageId: string) => {
    try {
      await resolveMessage(messageId);
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, status: "resolved" } : m));
    } catch {}
  };

  if (loading) {
    return (
      <main className="admin-fairytale flex items-center justify-center">
        <div className="relative z-10 text-center">
          <div className="w-14 h-14 rounded-full animate-spin mx-auto mb-4" style={{ border: "2px solid #FF5CA830", borderTopColor: "#FF5CA8" }} />
          <p style={{ fontFamily: "var(--font-fuzzy)", color: "#BC6CFF" }}>Yukleniyor...</p>
        </div>
      </main>
    );
  }

  if (!admin) return null;

  const stats = { toplamKullanici: users.length || "\u2014", toplamIlan: products.length || "\u2014" };

  return (
    <main className="admin-fairytale relative">
      <Sparkles />
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16">
        <div className="flex items-center justify-between mb-12">
          <div>
            <LilySmall className="w-8 h-8 opacity-40 mb-2" />
            <h1 style={{ fontFamily: "var(--font-fuzzy)", fontSize: "2rem" }} className="neon-shimmer">Yonetici Paneli</h1>
          </div>
          <button onClick={async () => { await logoutUser(); router.push("/"); }} className="px-5 py-2 rounded-sm" style={{ border: "1px solid #FF5CA840", color: "#FF5CA8", fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "0.15em" }}>Cikis</button>
        </div>

        <div className="flex gap-1 mb-8 flex-wrap" style={{ borderBottom: "1px solid #BC6CFF20" }}>
          {(["istatistik", "urunler", "urun-ekle", "kullanicilar", "siparisler", "mesajlar", "reklam", "musteriler"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className="fairytale-tab px-5 py-3 text-xs tracking-widest uppercase" style={{ fontFamily: "var(--font-cinzel)", color: tab === t ? "#FF5CA8" : "#BC6CFF" }}>
              {t === "istatistik" ? "Istatistikler" : t === "urunler" ? "Urunler" : t === "urun-ekle" ? "Urun Ekle" : t === "kullanicilar" ? "Kullanicilar" : t === "siparisler" ? "Siparisler" : t === "reklam" ? "Reklam" : t === "musteriler" ? "Musteriler" : "Mesajlar"}
            </button>
          ))}
        </div>

        {tab === "istatistik" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[{ label: "Toplam Urun", value: stats.toplamIlan, color: "#FF5CA8" }, { label: "Toplam Kullanici", value: stats.toplamKullanici, color: "#00F0FF" }].map((s, i) => (
              <div key={i} className="fairytale-card rounded-sm p-8 text-center">
                <p style={{ fontFamily: "var(--font-fuzzy)", fontSize: "2.5rem", color: s.color }} className={i === 0 ? "neon-text-pink" : "neon-text-cyan"}>{s.value}</p>
                <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF" }}>{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "urun-ekle" && (
          <div className="fairytale-card rounded-sm p-8 max-w-xl">
            <h2 style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8", fontSize: "1.3rem" }} className="mb-6 neon-text-pink">Yeni Urun Ekle</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Urun Adi" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="fairytale-input w-full px-5 py-4 rounded-sm" style={{ fontFamily: "var(--font-fuzzy)" }} />
              <textarea placeholder="Aciklama" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} rows={3} className="fairytale-input w-full px-5 py-4 rounded-sm resize-none" style={{ fontFamily: "var(--font-fuzzy)" }} />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Perakende Fiyat (TL)" value={newProduct.price || ""} onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })} className="fairytale-input w-full px-5 py-4 rounded-sm" style={{ fontFamily: "var(--font-fuzzy)" }} />
                <input type="number" placeholder="Toptan Fiyat (TL)" value={newProduct.wholesale_price || ""} onChange={(e) => setNewProduct({ ...newProduct, wholesale_price: Number(e.target.value) })} className="fairytale-input w-full px-5 py-4 rounded-sm" style={{ fontFamily: "var(--font-fuzzy)" }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Stok" value={newProduct.stock || ""} onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })} className="fairytale-input w-full px-5 py-4 rounded-sm" style={{ fontFamily: "var(--font-fuzzy)" }} />
              </div>
              <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="fairytale-input w-full px-5 py-4 rounded-sm" style={{ fontFamily: "var(--font-fuzzy)" }}>
                {["Giyim", "Aksesuar", "Dekorasyon", "Taki", "Canta", "Elektronik", "Diger"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="text" placeholder="Gorsel URL (opsiyonel)" value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} className="fairytale-input w-full px-5 py-4 rounded-sm" style={{ fontFamily: "var(--font-fuzzy)" }} />
              <div>
                <label style={{ fontFamily: "var(--font-cinzel)", color: "#BC6CFF", fontSize: "10px", letterSpacing: "0.15em", display: "block", marginBottom: "8px" }}>BEDEN SECENEKLERI</label>
                <div className="flex flex-wrap gap-2">
                  {["XS", "S", "M", "L", "XL", "XXL", "36", "37", "38", "39", "40", "41", "42", "43", "44"].map(size => (
                    <button key={size} type="button" onClick={() => {
                      const sizes = newProduct.sizes.includes(size) ? newProduct.sizes.filter(s => s !== size) : [...newProduct.sizes, size];
                      setNewProduct({ ...newProduct, sizes });
                    }} className="px-3 py-1.5 rounded-sm text-[10px] transition-all" style={{
                      fontFamily: "var(--font-cinzel)", letterSpacing: "0.05em",
                      background: newProduct.sizes.includes(size) ? "linear-gradient(135deg, #FF5CA8, #BC6CFF)" : "#0d1130",
                      border: newProduct.sizes.includes(size) ? "1px solid #FF5CA860" : "1px solid #BC6CFF30",
                      color: newProduct.sizes.includes(size) ? "#fff" : "#BC6CFF",
                      cursor: "pointer",
                    }}>{size}</button>
                  ))}
                </div>
              </div>
              <button onClick={handleAddProduct} className="fairytale-btn w-full py-4 rounded-sm" style={{ fontFamily: "var(--font-cinzel)", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                Urunu Ekle
              </button>
            </div>
          </div>
        )}

        {tab === "urunler" && (
          <div>
            <div className="space-y-3">
              {products.map(p => (
                <div key={p.id} className="fairytale-card rounded-sm p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-sm flex items-center justify-center flex-shrink-0" style={{ background: "#1a1040" }}>
                      {p.image ? <img src={p.image} className="w-full h-full object-cover rounded-sm" /> : <LilySmall className="w-6 h-6 opacity-30" />}
                    </div>
                    <div>
                      <p style={{ fontFamily: "var(--font-fuzzy)", color: "#E9CFE8" }}>{p.name}</p>
                      <p style={{ fontFamily: "var(--font-fuzzy)" }}><span className="neon-text-pink">TL{p.price.toLocaleString("tr-TR")}</span> <span style={{ color: "#FFB86B" }}> | Toptan: TL{(p.wholesale_price || 0).toLocaleString("tr-TR")}</span> <span style={{ color: "#BC6CFF" }}> | {p.category}</span></p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setReviewModal(p.id); setReviewRating(5); setReviewComment(""); }} className="px-4 py-2 rounded-sm" style={{ border: "1px solid #FFB86B40", color: "#FFB86B", fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "0.1em" }}>Yorum</button>
                    <button onClick={() => handleDeleteProduct(p.id)} className="px-4 py-2 rounded-sm" style={{ border: "1px solid #FF5CA840", color: "#FF5CA8", fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "0.1em" }}>Sil</button>
                  </div>
                </div>
              ))}
              {products.length === 0 && <p className="text-center py-12" style={{ fontFamily: "var(--font-fuzzy)", color: "#BC6CFF" }}>Henuz urun yok</p>}
            </div>
          </div>
        )}

        {tab === "kullanicilar" && (
          <div className="space-y-3">
            {users.map(u => (
              <div key={u.uid} className="fairytale-card rounded-sm p-5 flex items-center justify-between gap-4">
                <div>
                  <p style={{ fontFamily: "var(--font-fuzzy)", color: "#E9CFE8" }}>{u.name}</p>
                  <p style={{ fontFamily: "var(--font-fuzzy)", color: "#BC6CFF" }}>{u.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[9px] rounded-sm" style={{ fontFamily: "var(--font-cinzel)", background: u.role === "admin" ? "#FF5CA820" : "#00F0FF15", color: u.role === "admin" ? "#FF5CA8" : "#00F0FF" }}>
                    {u.role === "admin" ? "Admin" : "Kullanici"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleToggleRole(u.uid, u.role)} className="fairytale-btn px-4 py-2 rounded-sm" style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "0.1em" }}>
                    {u.role === "admin" ? "User Yap" : "Admin Yap"}
                  </button>
                  <button onClick={() => handleDeleteUser(u.uid)} className="px-4 py-2 rounded-sm" style={{ border: "1px solid #FF5CA840", color: "#FF5CA8", fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "0.1em" }}>Sil</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "siparisler" && (
          <div className="space-y-4">
            {orders.map(o => {
              const cargoCompanies = ["MNG Kargo", "PTT Kargo", "Aras Kargo", "Yurtici Kargo", "Surat Kargo", "HepsiJET"];
              const cargoStatuses = [
                { value: "pending", label: "Beklemede", color: "#FFB86B" },
                { value: "shipped", label: "Kargoya Verildi", color: "#00F0FF" },
                { value: "in_transit", label: "Yolda", color: "#BC6CFF" },
                { value: "delivered", label: "Teslim Edildi", color: "#00F0FF" },
              ];
              const orderStatuses = [
                { value: "pending", label: "Beklemede" },
                { value: "completed", label: "Tamamlandi" },
                { value: "cancelled", label: "Iptal" },
              ];
              const currentCargo = cargoStatuses.find(s => s.value === o.cargo_status) || cargoStatuses[0];

              return (
                <div key={o.id} className="fairytale-card rounded-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="px-3 py-1 rounded-sm text-[10px] font-bold" style={{ fontFamily: "var(--font-cinzel)", background: "#FF5CA820", color: "#FF5CA8", letterSpacing: "0.1em" }}>{o.order_code}</span>
                      <span className="px-2 py-0.5 rounded-sm text-[9px]" style={{ fontFamily: "var(--font-cinzel)", background: currentCargo.color + "20", color: currentCargo.color }}>
                        {currentCargo.label}
                      </span>
                      <span className="px-2 py-0.5 rounded-sm text-[9px]" style={{ fontFamily: "var(--font-cinzel)", background: "#BC6CFF20", color: "#BC6CFF" }}>
                        {orderStatuses.find(s => s.value === o.status)?.label || o.status}
                      </span>
                    </div>
                    <span style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8", fontSize: "1.1rem" }}>TL{Number(o.total).toLocaleString("tr-TR")}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
                    <div>
                      <p style={{ color: "#BC6CFF80", fontSize: "11px", fontFamily: "var(--font-cinzel)", letterSpacing: "0.1em" }}>Kullanici</p>
                      <p style={{ color: "#E9CFE8" }}>{o.user_uid.slice(0, 8)}...</p>
                    </div>
                    <div>
                      <p style={{ color: "#BC6CFF80", fontSize: "11px", fontFamily: "var(--font-cinzel)", letterSpacing: "0.1em" }}>Odeme</p>
                      <p style={{ color: "#E9CFE8" }}>{o.payment_method}</p>
                    </div>
                    <div>
                      <p style={{ color: "#BC6CFF80", fontSize: "11px", fontFamily: "var(--font-cinzel)", letterSpacing: "0.1em" }}>Tarih</p>
                      <p style={{ color: "#E9CFE8" }}>{new Date(o.created_at).toLocaleDateString("tr-TR")}</p>
                    </div>
                  </div>

                  {o.order_note && (
                    <div className="p-3 rounded-sm mb-4" style={{ background: "#FFB86B10", border: "1px solid #FFB86B30" }}>
                      <p style={{ fontFamily: "var(--font-cinzel)", color: "#FFB86B", fontSize: "9px", letterSpacing: "0.1em", marginBottom: "4px" }}>SIPARIS NOTU</p>
                      <p style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8" }}>{o.order_note}</p>
                    </div>
                  )}

                  {o.payment_method === "havale" && o.status === "pending" && (
                    <div className="p-4 rounded-sm mb-4" style={{ background: "#FFB86B10", border: "1px solid #FFB86B30" }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p style={{ fontFamily: "var(--font-cinzel)", color: "#FFB86B", fontSize: "10px", letterSpacing: "0.15em" }}>HAVALE/EFT ODEMESI</p>
                          <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF80", fontSize: "0.8rem", marginTop: "4px" }}>Banka hesabini kontrol edin, para geldiyse onaylayin</p>
                        </div>
                        <button onClick={() => handleUpdateCargo(o.id, o.cargo_company, o.cargo_tracking, o.cargo_status, "processing")} className="px-4 py-2 rounded-sm" style={{ background: "linear-gradient(135deg, #52b788, #00F0FF)", color: "#fff", fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "0.1em", cursor: "pointer" }}>
                          Odeme Onayla
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="p-4 rounded-sm" style={{ background: "#0d1130", border: "1px solid #BC6CFF20" }}>
                    <p style={{ fontFamily: "var(--font-cinzel)", color: "#FFB86B", fontSize: "10px", letterSpacing: "0.15em", marginBottom: "12px" }}>KARGO YONETIMI</p>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <label style={{ fontFamily: "var(--font-cinzel)", color: "#BC6CFF80", fontSize: "9px", letterSpacing: "0.1em" }}>Kargo Firmasi</label>
                        <select
                          value={o.cargo_company}
                          onChange={(e) => handleUpdateCargo(o.id, e.target.value, o.cargo_tracking, o.cargo_status, o.status)}
                          className="w-full px-3 py-2 rounded-sm mt-1 outline-none text-sm"
                          style={{ background: "#111535", border: "1px solid #BC6CFF30", color: "#E9CFE8", fontFamily: "var(--font-cormorant)" }}
                        >
                          <option value="">Sec...</option>
                          {cargoCompanies.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontFamily: "var(--font-cinzel)", color: "#BC6CFF80", fontSize: "9px", letterSpacing: "0.1em" }}>Takip Kodu</label>
                        <input
                          type="text"
                          placeholder="Takip numarasi"
                          value={o.cargo_tracking}
                          onChange={(e) => handleUpdateCargo(o.id, o.cargo_company, e.target.value, o.cargo_status, o.status)}
                          className="w-full px-3 py-2 rounded-sm mt-1 outline-none text-sm"
                          style={{ background: "#111535", border: "1px solid #BC6CFF30", color: "#E9CFE8", fontFamily: "var(--font-cormorant)" }}
                        />
                      </div>
                      <div>
                        <label style={{ fontFamily: "var(--font-cinzel)", color: "#BC6CFF80", fontSize: "9px", letterSpacing: "0.1em" }}>Kargo Durumu</label>
                        <select
                          value={o.cargo_status}
                          onChange={(e) => handleUpdateCargo(o.id, o.cargo_company, o.cargo_tracking, e.target.value, o.status)}
                          className="w-full px-3 py-2 rounded-sm mt-1 outline-none text-sm"
                          style={{ background: "#111535", border: "1px solid #BC6CFF30", color: "#E9CFE8", fontFamily: "var(--font-cormorant)" }}
                        >
                          {cargoStatuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontFamily: "var(--font-cinzel)", color: "#BC6CFF80", fontSize: "9px", letterSpacing: "0.1em" }}>Siparis Durumu</label>
                        <select
                          value={o.status}
                          onChange={(e) => handleUpdateCargo(o.id, o.cargo_company, o.cargo_tracking, o.cargo_status, e.target.value)}
                          className="w-full px-3 py-2 rounded-sm mt-1 outline-none text-sm"
                          style={{ background: "#111535", border: "1px solid #BC6CFF30", color: "#E9CFE8", fontFamily: "var(--font-cormorant)" }}
                        >
                          {orderStatuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {orders.length === 0 && <p className="text-center py-12" style={{ fontFamily: "var(--font-fuzzy)", color: "#BC6CFF" }}>Henuz siparis yok</p>}
          </div>
        )}

        {tab === "mesajlar" && (
          <div className="space-y-3">
            {messages.map(m => {
              const statusColors: Record<string, { bg: string; color: string; label: string }> = {
                pending: { bg: "#FFB86B20", color: "#FFB86B", label: "Bekliyor" },
                replied: { bg: "#00F0FF20", color: "#00F0FF", label: "Yanitlandi" },
                resolved: { bg: "#BC6CFF20", color: "#BC6CFF", label: "Kapandi" },
              };
              const st = statusColors[m.status] || statusColors.pending;
              return (
                <div key={m.id} className="fairytale-card rounded-sm p-5">
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <span style={{ fontFamily: "var(--font-fuzzy)", color: "#E9CFE8" }}>{m.user_name || "Kullanici"}</span>
                      <span className="px-2 py-0.5 rounded-sm text-[9px]" style={{ fontFamily: "var(--font-cinzel)", background: st.bg, color: st.color }}>{st.label}</span>
                    </div>
                    <span style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF60", fontSize: "0.8rem" }}>{new Date(m.created_at).toLocaleDateString("tr-TR")}</span>
                  </div>
                  {m.subject && <p style={{ fontFamily: "var(--font-cinzel)", color: "#FFB86B", fontSize: "10px", letterSpacing: "0.1em", marginBottom: "4px" }}>Konu: {m.subject}</p>}
                  <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF80", fontSize: "0.8rem", marginBottom: "8px" }}>{m.user_email}</p>
                  <p style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", lineHeight: 1.6 }}>{m.message}</p>
                  {m.reply && (
                    <div className="mt-3 p-3 rounded-sm" style={{ background: "#00F0FF10", border: "1px solid #00F0FF20" }}>
                      <p style={{ fontFamily: "var(--font-cinzel)", color: "#00F0FF", fontSize: "9px", letterSpacing: "0.1em", marginBottom: "4px" }}>YANITINIZ</p>
                      <p style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8" }}>{m.reply}</p>
                    </div>
                  )}
                  <div className="flex gap-2 mt-3">
                    {m.status !== "resolved" && (
                      <button onClick={() => { setReplyModal(m.id); setReplyText(m.reply || ""); }} className="px-4 py-2 rounded-sm" style={{ border: "1px solid #00F0FF40", color: "#00F0FF", fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "0.1em", cursor: "pointer" }}>
                        {m.reply ? "Yaniti Duzenle" : "Yanitla"}
                      </button>
                    )}
                    {m.status !== "resolved" && (
                      <button onClick={() => handleResolve(m.id)} className="px-4 py-2 rounded-sm" style={{ border: "1px solid #BC6CFF40", color: "#BC6CFF", fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "0.1em", cursor: "pointer" }}>
                        Kapat
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {messages.length === 0 && <p className="text-center py-12" style={{ fontFamily: "var(--font-fuzzy)", color: "#BC6CFF" }}>Henuz mesaj yok</p>}
          </div>
        )}

        {tab === "reklam" && (
          <div className="fairytale-card rounded-sm p-8 max-w-xl">
            <h2 style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8", fontSize: "1.3rem" }} className="mb-6 neon-text-pink">Reklam Yonetimi</h2>
            <div className="space-y-4">
              <div>
                <label style={{ fontFamily: "var(--font-cinzel)", color: "#BC6CFF80", fontSize: "9px", letterSpacing: "0.1em" }}>REKLAM METNI</label>
                <input
                  type="text"
                  defaultValue={typeof window !== "undefined" ? localStorage.getItem("semprexa_ad_text") || "Ozel Kampanya" : "Ozel Kampanya"}
                  onBlur={(e) => localStorage.setItem("semprexa_ad_text", e.target.value)}
                  className="fairytale-input w-full px-5 py-4 rounded-sm mt-1"
                  style={{ fontFamily: "var(--font-fuzzy)" }}
                  placeholder="Reklam metni..."
                />
              </div>
              <div>
                <label style={{ fontFamily: "var(--font-cinzel)", color: "#BC6CFF80", fontSize: "9px", letterSpacing: "0.1em" }}>REKLAM GORSELI (URL)</label>
                <input
                  type="text"
                  defaultValue={typeof window !== "undefined" ? localStorage.getItem("semprexa_ad_image") || "" : ""}
                  onBlur={(e) => { localStorage.setItem("semprexa_ad_image", e.target.value); }}
                  className="fairytale-input w-full px-5 py-4 rounded-sm mt-1"
                  style={{ fontFamily: "var(--font-fuzzy)" }}
                  placeholder="https://ornek.com/reklam.jpg"
                />
              </div>
              <div>
                <label style={{ fontFamily: "var(--font-cinzel)", color: "#BC6CFF80", fontSize: "9px", letterSpacing: "0.1em" }}>REKLAM LINKI</label>
                <input
                  type="text"
                  defaultValue={typeof window !== "undefined" ? localStorage.getItem("semprexa_ad_link") || "#" : "#"}
                  onBlur={(e) => localStorage.setItem("semprexa_ad_link", e.target.value)}
                  className="fairytale-input w-full px-5 py-4 rounded-sm mt-1"
                  style={{ fontFamily: "var(--font-fuzzy)" }}
                  placeholder="https://..."
                />
              </div>
              <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF60", fontSize: "0.85rem" }}>
                Degisiklikler aninda siteye yansir. Reklam gorseli yerine metin kullanabilirsiniz.
              </p>
            </div>
          </div>
        )}

        {tab === "musteriler" && (
          <div>
            <div className="fairytale-card rounded-sm p-6 mb-6">
              <h2 style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8", fontSize: "1.2rem" }} className="mb-4 neon-text-pink">Musteri Ara</h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Isim, e-posta veya telefon ile ara..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCustomerSearch()}
                  className="flex-1 px-4 py-3 rounded-sm outline-none"
                  style={{ background: "#0d1130", border: "1px solid #BC6CFF30", color: "#E9CFE8", fontFamily: "var(--font-cormorant)", fontSize: "0.95rem" }}
                />
                <button onClick={handleCustomerSearch} disabled={customerSearching || customerSearch.length < 2} className="px-6 py-3 rounded-sm" style={{
                  background: "linear-gradient(135deg, #FF5CA8, #BC6CFF)", color: "#fff", fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "0.15em",
                  cursor: customerSearching ? "wait" : "pointer", opacity: customerSearch.length < 2 ? 0.5 : 1,
                }}>
                  {customerSearching ? "Araniyor..." : "ARA"}
                </button>
              </div>
            </div>

            {customerResults.length > 0 && (
              <div className="space-y-4">
                {customerResults.map((c: Record<string, unknown>) => {
                  const orders = (c.orders || []) as Array<{ id: string; order_code: string; items: string; total: number; status: string; cargo_tracking: string; payment_method: string; created_at: string }>;
                  return (
                    <div key={c.uid as string} className="fairytale-card rounded-sm p-6">
                      <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                        <div>
                          <p style={{ fontFamily: "var(--font-fuzzy)", color: "#E9CFE8", fontSize: "1.1rem" }}>{(c.name as string) || "Isimsiz"}</p>
                          <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF", fontSize: "0.85rem" }}>{c.email as string}</p>
                          {c.phone ? <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF80", fontSize: "0.85rem" }}>{c.phone as string}</p> : null}
                          {c.gender ? <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF60", fontSize: "0.8rem" }}>{c.gender === "erkek" ? "Erkek" : "Kadin"} | {c.role as string === "admin" ? "Admin" : "Kullanici"}</p> : null}
                          <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF40", fontSize: "0.75rem", marginTop: "4px" }}>Kayit: {new Date(c.created_at as string).toLocaleDateString("tr-TR")}</p>
                        </div>
                        <span className="px-3 py-1 rounded-sm" style={{ fontFamily: "var(--font-cinzel)", fontSize: "10px", background: "#FF5CA820", color: "#FF5CA8" }}>
                          {orders.length} siparis | TL{orders.reduce((s: number, o: Record<string, unknown>) => s + (o.total as number || 0), 0).toLocaleString("tr-TR")}
                        </span>
                      </div>

                      {orders.length > 0 && (
                        <div className="space-y-2">
                          <p style={{ fontFamily: "var(--font-cinzel)", color: "#FFB86B", fontSize: "9px", letterSpacing: "0.1em", marginBottom: "8px" }}>SIPARIS GECMISI</p>
                          {orders.map(o => {
                            let items: Array<{ name: string; quantity: number; price: number }> = [];
                            try { items = JSON.parse(o.items); } catch {}
                            return (
                              <div key={o.id} className="p-3 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2" style={{ background: "#0d1130", border: "1px solid #BC6CFF15" }}>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span style={{ fontFamily: "var(--font-fuzzy)", color: "#E9CFE8", fontSize: "0.85rem" }}>{o.order_code}</span>
                                    <span className="px-1.5 py-0.5 rounded-sm text-[8px]" style={{ fontFamily: "var(--font-cinzel)", background: o.status === "delivered" ? "#52b78820" : o.status === "cancelled" ? "#e6394620" : "#FFB86B20", color: o.status === "delivered" ? "#52b788" : o.status === "cancelled" ? "#e63946" : "#FFB86B" }}>{o.status}</span>
                                  </div>
                                  <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF60", fontSize: "0.8rem" }}>
                                    {items.map(i => i.name).join(", ")}
                                  </p>
                                  {o.cargo_tracking && <p style={{ fontFamily: "var(--font-cormorant)", color: "#00F0FF", fontSize: "0.75rem" }}>{o.cargo_tracking}</p>}
                                </div>
                                <div className="text-right">
                                  <p style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8", fontSize: "0.95rem" }}>TL{o.total.toLocaleString("tr-TR")}</p>
                                  <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF40", fontSize: "0.7rem" }}>{new Date(o.created_at).toLocaleDateString("tr-TR")}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {customerSearch.length >= 2 && customerResults.length === 0 && !customerSearching && (
              <p className="text-center py-12" style={{ fontFamily: "var(--font-fuzzy)", color: "#BC6CFF" }}>Sonuc bulunamadi</p>
            )}
          </div>
        )}
      </div>

      {/* YORUM EKLEME MODALI */}
      {reviewModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4" style={{ background: "#0B0F2Bf0", backdropFilter: "blur(8px)" }} onClick={() => setReviewModal(null)}>
          <div className="w-full max-w-md p-6 rounded-sm" style={{ background: "#111535", border: "1px solid #BC6CFF30" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontFamily: "var(--font-fuzzy)", color: "#FFB86B", fontSize: "1.2rem" }} className="mb-4">Yorum / Puan Ekle</h3>

            <div className="mb-4">
              <label style={{ fontFamily: "var(--font-cinzel)", color: "#BC6CFF80", fontSize: "9px", letterSpacing: "0.1em" }}>PUAN</label>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <button key={i} onClick={() => setReviewRating(i)} className="text-2xl transition-all hover:scale-110" style={{ color: i <= reviewRating ? "#FFB86B" : "#BC6CFF30", cursor: "pointer" }}>*</button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label style={{ fontFamily: "var(--font-cinzel)", color: "#BC6CFF80", fontSize: "9px", letterSpacing: "0.1em" }}>YORUM</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Yorum yazin..."
                rows={4}
                className="w-full px-4 py-3 rounded-sm mt-2 outline-none resize-none"
                style={{ background: "#0d1130", border: "1px solid #BC6CFF30", color: "#E9CFE8", fontFamily: "var(--font-cormorant)", fontSize: "0.95rem" }}
              />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setReviewModal(null)} className="flex-1 py-3 rounded-sm" style={{ border: "1px solid #BC6CFF40", color: "#BC6CFF", fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "0.15em", cursor: "pointer" }}>IPTAL</button>
              <button onClick={() => handleAddReview(reviewModal)} className="flex-1 py-3 rounded-sm" style={{ background: "linear-gradient(135deg, #FFB86B, #FF5CA8)", color: "#fff", fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "0.15em", cursor: "pointer" }}>EKLE</button>
            </div>
          </div>
        </div>
      )}

      {/* MESAJ YANITLAMA MODALI */}
      {replyModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4" style={{ background: "#0B0F2Bf0", backdropFilter: "blur(8px)" }} onClick={() => setReplyModal(null)}>
          <div className="w-full max-w-md p-6 rounded-sm" style={{ background: "#111535", border: "1px solid #00F0FF30" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontFamily: "var(--font-fuzzy)", color: "#00F0FF", fontSize: "1.2rem" }} className="mb-4 neon-text-cyan">Yanit Yaz</h3>
            <div className="mb-4">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Yanitinizi yazin..."
                rows={5}
                className="w-full px-4 py-3 rounded-sm outline-none resize-none"
                style={{ background: "#0d1130", border: "1px solid #BC6CFF30", color: "#E9CFE8", fontFamily: "var(--font-cormorant)", fontSize: "0.95rem" }}
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setReplyModal(null)} className="flex-1 py-3 rounded-sm" style={{ border: "1px solid #BC6CFF40", color: "#BC6CFF", fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "0.15em", cursor: "pointer" }}>IPTAL</button>
              <button onClick={() => handleReply(replyModal)} disabled={!replyText.trim()} className="flex-1 py-3 rounded-sm" style={{ background: replyText.trim() ? "linear-gradient(135deg, #00F0FF, #BC6CFF)" : "#111535", color: replyText.trim() ? "#fff" : "#BC6CFF60", fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "0.15em", border: "1px solid #00F0FF40", cursor: replyText.trim() ? "pointer" : "default" }}>GONDER</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
