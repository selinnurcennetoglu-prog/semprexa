"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthChange, logoutUser } from "../lib/auth";
import { getProducts, createProduct, deleteProduct, getUsers, deleteUser, updateUserRole, type Product } from "../lib/db";
import { getAccessToken } from "../lib/auth";
import { LilySmall } from "../components/Decorations";

interface UserProfile { uid: string; name: string; email: string; phone: string; role: string; created_at: string; phone_verified: boolean; }
interface Order { id: string; order_code: string; user_uid: string; items: string; address: string; total: number; status: string; payment_method: string; created_at: string; }

function Sparkles() {
  const dots = Array.from({ length: 15 }, (_, i) => ({
    left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, delay: `${Math.random() * 6}s`, size: `${2 + Math.random() * 4}px`,
  }));
  return (<>{dots.map((d, i) => (<div key={i} className="sparkle-dot" style={{ left: d.left, top: d.top, animationDelay: d.delay, width: d.size, height: d.size }} />))}</>);
}

export default function AdminPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"istatistik" | "urunler" | "kullanicilar" | "urun-ekle" | "siparisler">("istatistik");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: 0, category: "Diğer", image: "", stock: 10, featured: false });

  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      if (!u) { router.push("/admin/giris"); return; }
      if (u.role !== "admin") { router.push("/admin/giris"); return; }
      setAdmin(true); setLoading(false);
      loadUsers();
      loadProducts();
    });
    return () => { unsub.then(fn => fn()); };
  }, [router]);

  const loadUsers = async () => {     const u = await getUsers(); setUsers(u as unknown as UserProfile[]); };
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

  useEffect(() => {
    if (tab === "kullanicilar") loadUsers();
    if (tab === "urunler") loadProducts();
    if (tab === "istatistik") { loadUsers(); loadProducts(); }
    if (tab === "siparisler") loadOrders();
  }, [tab]);

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) { alert("İsim ve fiyat gerekli."); return; }
    try {
      await createProduct(newProduct);
      alert("Ürün eklendi!");
      setNewProduct({ name: "", description: "", price: 0, category: "Diğer", image: "", stock: 10, featured: false });
      setTab("urunler");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Hata";
      alert("Ürün eklenemedi: " + msg);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err: unknown) {
      alert("Silinemedi: " + (err instanceof Error ? err.message : "Hata"));
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (!confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return;
    await deleteUser(uid);
    setUsers(prev => prev.filter(u => u.uid !== uid));
  };

  const handleToggleRole = async (uid: string, role: string) => {
    const newRole = role === "admin" ? "user" : "admin";
    await updateUserRole(uid, newRole);
    setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role: newRole } : u));
  };

  if (loading) {
    return (
      <main className="admin-fairytale flex items-center justify-center">
        <div className="relative z-10 text-center">
          <div className="w-14 h-14 rounded-full animate-spin mx-auto mb-4" style={{ border: "2px solid #FF5CA830", borderTopColor: "#FF5CA8" }} />
          <p style={{ fontFamily: "var(--font-fuzzy)", color: "#BC6CFF" }}>✦ Yükleniyor...</p>
        </div>
      </main>
    );
  }

  if (!admin) return null;

  const stats = { toplamKullanici: users.length || "—", toplamIlan: products.length || "—" };

  return (
    <main className="admin-fairytale relative">
      <Sparkles />
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16">
        <div className="flex items-center justify-between mb-12">
          <div>
            <LilySmall className="w-8 h-8 opacity-40 mb-2" />
            <h1 style={{ fontFamily: "var(--font-fuzzy)", fontSize: "2rem" }} className="neon-shimmer">Yönetici Paneli</h1>
          </div>
          <button onClick={async () => { await logoutUser(); router.push("/"); }} className="px-5 py-2 rounded-sm" style={{ border: "1px solid #FF5CA840", color: "#FF5CA8", fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "0.15em" }}>Çıkış</button>
        </div>

        <div className="flex gap-1 mb-8 flex-wrap" style={{ borderBottom: "1px solid #BC6CFF20" }}>
          {(["istatistik", "urunler", "urun-ekle", "kullanicilar", "siparisler"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`fairytale-tab px-5 py-3 text-xs tracking-widest uppercase`} style={{ fontFamily: "var(--font-cinzel)", color: tab === t ? "#FF5CA8" : "#BC6CFF" }}>
              {t === "istatistik" ? "İstatistikler" : t === "urunler" ? "Ürünler" : t === "urun-ekle" ? "Ürün Ekle" : t === "kullanicilar" ? "Kullanıcılar" : "Siparişler"}
            </button>
          ))}
        </div>

        {tab === "istatistik" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[{ label: "Toplam Ürün", value: stats.toplamIlan, color: "#FF5CA8" }, { label: "Toplam Kullanıcı", value: stats.toplamKullanici, color: "#00F0FF" }].map((s, i) => (
              <div key={i} className="fairytale-card rounded-sm p-8 text-center">
                <p style={{ fontFamily: "var(--font-fuzzy)", fontSize: "2.5rem", color: s.color }} className={i === 0 ? "neon-text-pink" : "neon-text-cyan"}>{s.value}</p>
                <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF" }}>{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "urun-ekle" && (
          <div className="fairytale-card rounded-sm p-8 max-w-xl">
            <h2 style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8", fontSize: "1.3rem" }} className="mb-6 neon-text-pink">✦ Yeni Ürün Ekle</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Ürün Adı" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="fairytale-input w-full px-5 py-4 rounded-sm" style={{ fontFamily: "var(--font-fuzzy)" }} />
              <textarea placeholder="Açıklama" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} rows={3} className="fairytale-input w-full px-5 py-4 rounded-sm resize-none" style={{ fontFamily: "var(--font-fuzzy)" }} />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Fiyat (₺)" value={newProduct.price || ""} onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })} className="fairytale-input w-full px-5 py-4 rounded-sm" style={{ fontFamily: "var(--font-fuzzy)" }} />
                <input type="number" placeholder="Stok" value={newProduct.stock || ""} onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })} className="fairytale-input w-full px-5 py-4 rounded-sm" style={{ fontFamily: "var(--font-fuzzy)" }} />
              </div>
              <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="fairytale-input w-full px-5 py-4 rounded-sm" style={{ fontFamily: "var(--font-fuzzy)" }}>
                {["Giyim", "Aksesuar", "Dekorasyon", "Takı", "Çanta", "Elektronik", "Diğer"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="text" placeholder="Görsel URL (opsiyonel)" value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} className="fairytale-input w-full px-5 py-4 rounded-sm" style={{ fontFamily: "var(--font-fuzzy)" }} />
              <button onClick={handleAddProduct} className="fairytale-btn w-full py-4 rounded-sm" style={{ fontFamily: "var(--font-cinzel)", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                ✦ Ürünü Ekle
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
                      <p style={{ fontFamily: "var(--font-fuzzy)" }}><span className="neon-text-pink">₺{p.price.toLocaleString("tr-TR")}</span> <span style={{ color: "#BC6CFF" }}>· {p.category}</span></p>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteProduct(p.id)} className="px-4 py-2 rounded-sm" style={{ border: "1px solid #FF5CA840", color: "#FF5CA8", fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "0.1em" }}>✕ Sil</button>
                </div>
              ))}
              {products.length === 0 && <p className="text-center py-12" style={{ fontFamily: "var(--font-fuzzy)", color: "#BC6CFF" }}>✦ Henüz ürün yok</p>}
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
                    {u.role === "admin" ? "👑 Admin" : "🌿 Kullanıcı"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleToggleRole(u.uid, u.role)} className="fairytale-btn px-4 py-2 rounded-sm" style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "0.1em" }}>
                    {u.role === "admin" ? "User Yap" : "Admin Yap"}
                  </button>
                  <button onClick={() => handleDeleteUser(u.uid)} className="px-4 py-2 rounded-sm" style={{ border: "1px solid #FF5CA840", color: "#FF5CA8", fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "0.1em" }}>✕</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "siparisler" && (
          <div className="space-y-3">
            {orders.map(o => (
              <div key={o.id} className="fairytale-card rounded-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-sm text-[10px] font-bold" style={{ fontFamily: "var(--font-cinzel)", background: "#FF5CA820", color: "#FF5CA8", letterSpacing: "0.1em" }}>{o.order_code || "SPR-000000"}</span>
                    <span className="px-2 py-0.5 rounded-sm text-[9px]" style={{ fontFamily: "var(--font-cinzel)", background: o.status === "pending" ? "#FFB86B20" : o.status === "completed" ? "#00F0FF20" : "#FF5CA820", color: o.status === "pending" ? "#FFB86B" : o.status === "completed" ? "#00F0FF" : "#FF5CA8" }}>
                      {o.status === "pending" ? "Beklemede" : o.status === "completed" ? "Tamamlandı" : o.status === "shipped" ? "Kargoda" : o.status}
                    </span>
                  </div>
                  <span style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8", fontSize: "1.1rem" }}>₺{Number(o.total).toLocaleString("tr-TR")}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm" style={{ fontFamily: "var(--font-cormorant)" }}>
                  <div>
                    <p style={{ color: "#BC6CFF80", fontSize: "11px", fontFamily: "var(--font-cinzel)", letterSpacing: "0.1em" }}>Kullanıcı</p>
                    <p style={{ color: "#E9CFE8" }}>{o.user_uid.slice(0, 8)}...</p>
                  </div>
                  <div>
                    <p style={{ color: "#BC6CFF80", fontSize: "11px", fontFamily: "var(--font-cinzel)", letterSpacing: "0.1em" }}>Ödeme</p>
                    <p style={{ color: "#E9CFE8" }}>{o.payment_method}</p>
                  </div>
                  <div>
                    <p style={{ color: "#BC6CFF80", fontSize: "11px", fontFamily: "var(--font-cinzel)", letterSpacing: "0.1em" }}>Tarih</p>
                    <p style={{ color: "#E9CFE8" }}>{new Date(o.created_at).toLocaleDateString("tr-TR")}</p>
                  </div>
                </div>
              </div>
            ))}
            {orders.length === 0 && <p className="text-center py-12" style={{ fontFamily: "var(--font-fuzzy)", color: "#BC6CFF" }}>✦ Henüz sipariş yok</p>}
          </div>
        )}
      </div>
    </main>
  );
}
