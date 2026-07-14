"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, collection, getDocs, deleteDoc, updateDoc } from "firebase/firestore";
import { logoutUser } from "../lib/auth";
import type { Listing } from "../lib/db";

interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  phoneVerified: boolean;
}

export default function AdminPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"istatistik" | "kullanicilar" | "ilanlar">("istatistik");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [searchUser, setSearchUser] = useState("");
  const [searchListing, setSearchListing] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push("/admin/giris"); return; }
      const snap = await getDoc(doc(db, "users", u.uid));
      if (!snap.exists() || snap.data().role !== "admin") { router.push("/admin/giris"); return; }
      setAdmin(true);
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  const loadUsers = async () => {
    const snap = await getDocs(collection(db, "users"));
    setUsers(snap.docs.map(d => ({ uid: d.id, ...d.data() } as UserProfile)));
  };

  const loadListings = async () => {
    const snap = await getDocs(collection(db, "listings"));
    setListings(snap.docs.map(d => ({ id: d.id, ...d.data() } as Listing)));
  };

  useEffect(() => {
    if (tab === "kullanicilar") loadUsers();
    if (tab === "ilanlar") loadListings();
  }, [tab]);

  const toggleRole = async (uid: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    await updateDoc(doc(db, "users", uid), { role: newRole });
    setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role: newRole } : u));
  };

  const deleteListing = async (id: string) => {
    if (!confirm("Bu ilanı silmek istediğinize emin misiniz?")) return;
    await deleteDoc(doc(db, "listings", id));
    setListings(prev => prev.filter(l => l.id !== id));
  };

  const deleteUser = async (uid: string) => {
    if (!confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return;
    await deleteDoc(doc(db, "users", uid));
    setUsers(prev => prev.filter(u => u.uid !== uid));
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
          <p className="font-cormorant text-taupe">Yükleniyor...</p>
        </div>
      </main>
    );
  }

  if (!admin) return null;

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  const filteredListings = listings.filter(l =>
    l.title.toLowerCase().includes(searchListing.toLowerCase()) ||
    l.company.toLowerCase().includes(searchListing.toLowerCase())
  );

  const stats = {
    toplamKullanici: users.length || "—",
    toplamIlan: listings.length || "—",
    adminSayisi: users.filter(u => u.role === "admin").length || 0,
  };

  return (
    <main className="min-h-screen bg-cream pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="font-cinzel text-[10px] tracking-[0.5em] uppercase text-gold-dark/60 block mb-2">Yönetim Paneli</span>
            <h1 className="font-playfair text-3xl font-bold text-coffee-dark">Semprenxa <span className="text-gold">Admin</span></h1>
          </div>
          <button onClick={async () => { await logoutUser(); router.push("/"); }} className="px-5 py-2 border border-gold/30 text-gold text-xs tracking-widest uppercase hover:bg-gold/10 transition-all">
            Çıkış
          </button>
        </div>

        <div className="flex gap-1 mb-8 border-b border-gold/10">
          {(["istatistik", "kullanicilar", "ilanlar"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-6 py-3 font-cinzel text-xs tracking-widest uppercase transition-all ${tab === t ? "text-gold border-b-2 border-gold" : "text-taupe/40 hover:text-taupe"}`}>
              {t === "istatistik" ? "İstatistikler" : t === "kullanicilar" ? "Kullanıcılar" : "İlanlar"}
            </button>
          ))}
        </div>

        {tab === "istatistik" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Toplam Kullanıcı", value: stats.toplamKullanici, icon: "👤" },
              { label: "Toplam İlan", value: stats.toplamIlan, icon: "📋" },
              { label: "Admin Sayısı", value: stats.adminSayisi, icon: "👑" },
            ].map((s, i) => (
              <div key={i} className="royal-frame p-8 bg-cream/80 text-center">
                <span className="text-3xl block mb-3">{s.icon}</span>
                <p className="font-playfair text-3xl font-bold text-gold mb-2">{s.value}</p>
                <p className="font-cormorant text-sm text-taupe">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "kullanicilar" && (
          <div>
            <input type="text" placeholder="Kullanıcı ara..." value={searchUser} onChange={(e) => setSearchUser(e.target.value)} className="w-full mb-6 px-5 py-4 bg-cream border border-gold/15 text-coffee-dark font-cormorant placeholder:text-taupe/40 focus:outline-none focus:border-gold/40" />
            <div className="space-y-3">
              {filteredUsers.map(u => (
                <div key={u.uid} className="royal-frame p-5 bg-cream/80 flex items-center justify-between">
                  <div>
                    <p className="font-playfair text-base text-coffee-dark font-semibold">{u.name}</p>
                    <p className="font-cormorant text-sm text-taupe">{u.email}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-cinzel tracking-wider uppercase ${u.role === "admin" ? "bg-gold/20 text-gold-dark" : "bg-sand/20 text-taupe"}`}>
                      {u.role}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggleRole(u.uid, u.role)} className="px-4 py-2 border border-gold/30 text-gold text-xs tracking-wider uppercase hover:bg-gold/10 transition-all">
                      {u.role === "admin" ? "User Yap" : "Admin Yap"}
                    </button>
                    <button onClick={() => deleteUser(u.uid)} className="px-4 py-2 border border-red-400/30 text-red-400 text-xs tracking-wider uppercase hover:bg-red-400/10 transition-all">
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "ilanlar" && (
          <div>
            <input type="text" placeholder="İlan ara..." value={searchListing} onChange={(e) => setSearchListing(e.target.value)} className="w-full mb-6 px-5 py-4 bg-cream border border-gold/15 text-coffee-dark font-cormorant placeholder:text-taupe/40 focus:outline-none focus:border-gold/40" />
            <div className="space-y-3">
              {filteredListings.map(l => (
                <div key={l.id} className="royal-frame p-5 bg-cream/80 flex items-center justify-between">
                  <div>
                    <p className="font-playfair text-base text-coffee-dark font-semibold">{l.title}</p>
                    <p className="font-cormorant text-sm text-taupe">{l.company} · {l.type} · {l.date}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Link href={`/ilan/${l.id}`} className="px-4 py-2 border border-gold/30 text-gold text-xs tracking-wider uppercase hover:bg-gold/10 transition-all">
                      Gör
                    </Link>
                    <button onClick={() => deleteListing(l.id)} className="px-4 py-2 border border-red-400/30 text-red-400 text-xs tracking-wider uppercase hover:bg-red-400/10 transition-all">
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
