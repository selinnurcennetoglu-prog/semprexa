"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, collection, getDocs, deleteDoc, updateDoc } from "firebase/firestore";
import { logoutUser } from "../lib/auth";
import { getProducts, createProduct, deleteProduct, type Product } from "../lib/db";
import { LilySmall } from "../components/Decorations";

interface UserProfile { uid: string; name: string; email: string; phone: string; role: string; createdAt: string; phoneVerified: boolean; }

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
  const [tab, setTab] = useState<"istatistik" | "urunler" | "kullanicilar" | "urun-ekle">("istatistik");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: 0, category: "Diğer", image: "", stock: 10, featured: false });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push("/admin/giris"); return; }
      const snap = await getDoc(doc(db, "users", u.uid));
      if (!snap.exists() || snap.data().role !== "admin") { router.push("/admin/giris"); return; }
      setAdmin(true); setLoading(false);
    });
    return () => unsub();
  }, [router]);

  const loadUsers = async () => { const snap = await getDocs(collection(db, "users")); setUsers(snap.docs.map(d => ({ uid: d.id, ...d.data() } as UserProfile))); };
  const loadProducts = async () => { const p = await getProducts(); setProducts(p); };

  useEffect(() => {
    if (tab === "kullanicilar") loadUsers();
    if (tab === "urunler") loadProducts();
  }, [tab]);

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) { alert("İsim ve fiyat gerekli."); return; }
    await createProduct(newProduct);
    alert("Ürün eklendi!");
    setNewProduct({ name: "", description: "", price: 0, category: "Diğer", image: "", stock: 10, featured: false });
    setTab("urunler");
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    await deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleDeleteUser = async (uid: string) => {
    if (!confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return;
    await deleteDoc(doc(db, "users", uid));
    setUsers(prev => prev.filter(u => u.uid !== uid));
  };

  const handleToggleRole = async (uid: string, role: string) => {
    const newRole = role === "admin" ? "user" : "admin";
    await updateDoc(doc(db, "users", uid), { role: newRole });
    setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role: newRole } : u));
  };

  if (loading) {
    return (
      <main className="admin-fairytale flex items-center justify-center">
        <div className="relative z-10 text-center">
          <div className="w-14 h-14 rounded-full animate-spin mx-auto mb-4" style={{ border: "2px solid #E21C7030", borderTopColor: "#E21C70" }} />
          <p style={{ fontFamily: "var(--font-fuzzy)", color: "#872D72" }}>✦ Yükleniyor...</p>
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
            <h1 style={{ fontFamily: "var(--font-yuyu)", fontSize: "2rem", color: "#E21C70" }}>Yönetici Paneli</h1>
          </div>
          <button onClick={async () => { await logoutUser(); router.push("/"); }} className="px-5 py-2 rounded-sm" style={{ border: "1px solid #E21C7040", color: "#E21C70", fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "0.15em" }}>Çıkış</button>
        </div>

        <div className="flex gap-1 mb-8 flex-wrap" style={{ borderBottom: "1px solid #7C4EBB20" }}>
          {(["istatistik", "urunler", "urun-ekle", "kullanicilar"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`fairytale-tab px-5 py-3 text-xs tracking-widest uppercase`} style={{ fontFamily: "var(--font-cinzel)", color: tab === t ? "#E21C70" : "#872D72" }}>
              {t === "istatistik" ? "İstatistikler" : t === "urunler" ? "Ürünler" : t === "urun-ekle" ? "Ürün Ekle" : "Kullanıcılar"}
            </button>
          ))}
        </div>

        {tab === "istatistik" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[{ label: "Toplam Ürün", value: stats.toplamIlan, icon: "🌸" }, { label: "Toplam Kullanıcı", value: stats.toplamKullanici, icon: "🌿" }].map((s, i) => (
              <div key={i} className="fairytale-card rounded-sm p-8 text-center">
                <span className="text-3xl block mb-3">{s.icon}</span>
                <p style={{ fontFamily: "var(--font-fuzzy)", fontSize: "2.5rem", color: "#E21C70" }}>{s.value}</p>
                <p style={{ fontFamily: "var(--font-cormorant)", color: "#872D72" }}>{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "urun-ekle" && (
          <div className="fairytale-card rounded-sm p-8 max-w-xl">
            <h2 style={{ fontFamily: "var(--font-yuyu)", color: "#E21C70", fontSize: "1.3rem" }} className="mb-6">✦ Yeni Ürün Ekle</h2>
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
                    <div className="w-12 h-12 rounded-sm flex items-center justify-center flex-shrink-0" style={{ background: "#411E57" }}>
                      {p.image ? <img src={p.image} className="w-full h-full object-cover rounded-sm" /> : <LilySmall className="w-6 h-6 opacity-30" />}
                    </div>
                    <div>
                      <p style={{ fontFamily: "var(--font-yuyu)", color: "#E9CFE8" }}>{p.name}</p>
                      <p style={{ fontFamily: "var(--font-fuzzy)", color: "#E21C70" }}>₺{p.price.toLocaleString("tr-TR")} · {p.category}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteProduct(p.id)} className="px-4 py-2 rounded-sm" style={{ border: "1px solid #AE084940", color: "#AE0849", fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "0.1em" }}>✕ Sil</button>
                </div>
              ))}
              {products.length === 0 && <p className="text-center py-12" style={{ fontFamily: "var(--font-fuzzy)", color: "#872D72" }}>✦ Henüz ürün yok</p>}
            </div>
          </div>
        )}

        {tab === "kullanicilar" && (
          <div className="space-y-3">
            {users.map(u => (
              <div key={u.uid} className="fairytale-card rounded-sm p-5 flex items-center justify-between gap-4">
                <div>
                  <p style={{ fontFamily: "var(--font-yuyu)", color: "#E9CFE8" }}>{u.name}</p>
                  <p style={{ fontFamily: "var(--font-fuzzy)", color: "#872D72" }}>{u.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[9px] rounded-sm" style={{ fontFamily: "var(--font-cinzel)", background: u.role === "admin" ? "#E21C7020" : "#7C4EBB15", color: u.role === "admin" ? "#E21C70" : "#7C4EBB" }}>
                    {u.role === "admin" ? "👑 Admin" : "🌿 Kullanıcı"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleToggleRole(u.uid, u.role)} className="fairytale-btn px-4 py-2 rounded-sm" style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "0.1em" }}>
                    {u.role === "admin" ? "User Yap" : "Admin Yap"}
                  </button>
                  <button onClick={() => handleDeleteUser(u.uid)} className="px-4 py-2 rounded-sm" style={{ border: "1px solid #AE084940", color: "#AE0849", fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "0.1em" }}>✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
