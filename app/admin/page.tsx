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

function VineSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M60 0 C60 40, 20 60, 30 100 S80 140, 60 180 S20 220, 40 260 S80 300, 60 340 S30 370, 60 400 S80 440, 60 480 S20 520, 40 560 S80 580, 60 600" stroke="#6b8f5e" strokeWidth="2" opacity="0.25" fill="none"/>
      <path d="M30 100 C20 95, 10 80, 5 70 M30 100 C20 105, 10 110, 5 120" stroke="#6b8f5e" strokeWidth="1.5" opacity="0.2" fill="none"/>
      <path d="M60 180 C50 175, 40 160, 35 150 M60 180 C70 175, 80 185, 90 195" stroke="#6b8f5e" strokeWidth="1.5" opacity="0.2" fill="none"/>
      <path d="M40 260 C30 255, 20 240, 15 230 M40 260 C50 265, 60 270, 70 280" stroke="#6b8f5e" strokeWidth="1.5" opacity="0.2" fill="none"/>
      <path d="M60 340 C50 335, 40 320, 35 310 M60 340 C70 335, 80 345, 90 355" stroke="#6b8f5e" strokeWidth="1.5" opacity="0.2" fill="none"/>
      <path d="M40 460 C30 455, 20 440, 15 430 M40 460 C50 465, 60 470, 70 480" stroke="#6b8f5e" strokeWidth="1.5" opacity="0.2" fill="none"/>
      <ellipse cx="5" cy="70" rx="10" ry="6" fill="#6b8f5e" opacity="0.1" transform="rotate(-30 5 70)"/>
      <ellipse cx="90" cy="195" rx="10" ry="6" fill="#6b8f5e" opacity="0.1" transform="rotate(20 90 195)"/>
      <ellipse cx="15" cy="230" rx="10" ry="6" fill="#6b8f5e" opacity="0.1" transform="rotate(-25 15 230)"/>
      <ellipse cx="90" cy="355" rx="10" ry="6" fill="#6b8f5e" opacity="0.1" transform="rotate(15 90 355)"/>
      <ellipse cx="70" cy="480" rx="10" ry="6" fill="#6b8f5e" opacity="0.1" transform="rotate(25 70 480)"/>
    </svg>
  );
}

function LeafSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 5 C25 10, 35 15, 35 25 C35 32, 28 37, 20 37 C12 37, 5 32, 5 25 C5 15, 15 10, 20 5Z" fill="#6b8f5e" opacity="0.12"/>
      <path d="M20 5 L20 37" stroke="#6b8f5e" strokeWidth="0.5" opacity="0.18"/>
      <path d="M20 12 L12 20 M20 18 L28 24 M20 25 L14 30" stroke="#6b8f5e" strokeWidth="0.3" opacity="0.12"/>
    </svg>
  );
}

function FlowerSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15" cy="15" r="3" fill="#c96b8b" opacity="0.3"/>
      <ellipse cx="15" cy="8" rx="3" ry="5" fill="#c96b8b" opacity="0.15"/>
      <ellipse cx="21" cy="12" rx="3" ry="5" fill="#c96b8b" opacity="0.15" transform="rotate(60 21 12)"/>
      <ellipse cx="21" cy="19" rx="3" ry="5" fill="#c96b8b" opacity="0.15" transform="rotate(120 21 19)"/>
      <ellipse cx="15" cy="22" rx="3" ry="5" fill="#c96b8b" opacity="0.15" transform="rotate(180 15 22)"/>
      <ellipse cx="9" cy="19" rx="3" ry="5" fill="#c96b8b" opacity="0.15" transform="rotate(240 9 19)"/>
      <ellipse cx="9" cy="12" rx="3" ry="5" fill="#c96b8b" opacity="0.15" transform="rotate(300 9 12)"/>
    </svg>
  );
}

function Sparkles() {
  const dots = Array.from({ length: 20 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 6}s`,
    size: `${2 + Math.random() * 5}px`,
    color: Math.random() > 0.5 ? "#c96b8b" : "#dbc48a",
  }));
  return (
    <>
      {dots.map((d, i) => (
        <div
          key={i}
          className="sparkle-dot"
          style={{ left: d.left, top: d.top, animationDelay: d.delay, width: d.size, height: d.size, background: `radial-gradient(circle, ${d.color}80, ${d.color}40, transparent)` }}
        />
      ))}
    </>
  );
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
      <main className="admin-fairytale flex items-center justify-center">
        <div className="relative z-10 text-center">
          <div className="w-14 h-14 rounded-full animate-spin mx-auto mb-4" style={{ border: "2px solid #c96b8b30", borderTopColor: "#c96b8b" }} />
          <p className="font-cormorant text-lg" style={{ color: "#8b7a6b" }}>✦ Periler hazırlanıyor...</p>
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
    <main className="admin-fairytale relative">
      <Sparkles />

      <div className="vine-decoration left-0 top-0 w-20 h-[600px] opacity-30 hidden lg:block">
        <VineSVG className="w-full h-full" />
      </div>
      <div className="vine-decoration right-0 top-20 w-20 h-[600px] opacity-25 hidden lg:block" style={{ animationDelay: "2s" }}>
        <VineSVG className="w-full h-full transform scale-x-[-1]" />
      </div>

      {[15, 35, 55, 75].map((top, i) => (
        <div key={i} className="leaf-decoration hidden lg:block" style={{ left: `${10 + i * 20}%`, top: `${top}%`, animationDelay: `${i * 1.2}s` }}>
          <LeafSVG className="w-8 h-8" />
        </div>
      ))}

      {["5%", "92%", "48%", "75%"].map((left, i) => (
        <div key={i} className="hidden lg:block absolute" style={{ left, top: `${5 + i * 25}%`, animationDelay: `${i}s` }}>
          <FlowerSVG className="w-6 h-6 opacity-40" />
        </div>
      ))}

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <LeafSVG className="w-6 h-6 opacity-50" />
              <span className="font-cinzel text-[10px] tracking-[0.5em] uppercase" style={{ color: "#c96b8b" }}>
                Peri Sarayı
              </span>
              <LeafSVG className="w-6 h-6 opacity-50 transform scale-x-[-1]" />
            </div>
            <h1 className="font-playfair text-3xl md:text-4xl font-bold" style={{ color: "#5a2a3a" }}>
              Yönetici <span style={{ color: "#c96b8b" }}>Paneli</span>
            </h1>
          </div>
          <button
            onClick={async () => { await logoutUser(); router.push("/"); }}
            className="px-5 py-2 rounded-sm font-cinzel text-xs tracking-widest uppercase transition-all"
            style={{ border: "1px solid #c96b8b40", color: "#c96b8b" }}
          >
            ✦ Çıkış
          </button>
        </div>

        <div className="flex gap-1 mb-8" style={{ borderBottom: "1px solid #c96b8b20" }}>
          {(["istatistik", "kullanicilar", "ilanlar"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`fairytale-tab px-6 py-3 font-cinzel text-xs tracking-widest uppercase ${tab === t ? "active" : ""}`}
              style={{ color: tab === t ? "#c96b8b" : "#8b7a6b" }}
            >
              {t === "istatistik" ? "✦ İstatistikler" : t === "kullanicilar" ? "✦ Kullanıcılar" : "✦ İlanlar"}
            </button>
          ))}
        </div>

        {tab === "istatistik" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Toplam Kullanıcı", value: stats.toplamKullanici, icon: "🌿", color: "#6b8f5e" },
              { label: "Toplam İlan", value: stats.toplamIlan, icon: "🌸", color: "#c96b8b" },
              { label: "Admin Sayısı", value: stats.adminSayisi, icon: "👑", color: "#c96b8b" },
            ].map((s, i) => (
              <div key={i} className="fairytale-card rounded-sm p-8 text-center" style={{ animationDelay: `${i * 0.2}s` }}>
                <span className="text-3xl block mb-3">{s.icon}</span>
                <p className="font-playfair text-3xl font-bold mb-2" style={{ color: s.color }}>{s.value}</p>
                <p className="font-cormorant text-sm" style={{ color: "#8b7a6b" }}>{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "kullanicilar" && (
          <div>
            <input
              type="text"
              placeholder="✦ Kullanıcı ara..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="fairytale-input w-full mb-6 px-5 py-4 rounded-sm font-cormorant placeholder:text-[#b09a8a]/50"
            />
            <div className="space-y-3">
              {filteredUsers.map(u => (
                <div key={u.uid} className="fairytale-card rounded-sm p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-playfair text-base font-semibold" style={{ color: "#5a2a3a" }}>{u.name}</p>
                    <p className="font-cormorant text-sm" style={{ color: "#8b7a6b" }}>{u.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-cinzel tracking-wider uppercase rounded-sm"
                      style={{ background: u.role === "admin" ? "#c96b8b20" : "#6b8f5e15", color: u.role === "admin" ? "#c96b8b" : "#6b8f5e" }}>
                      {u.role === "admin" ? "👑 Admin" : "🌿 Kullanıcı"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggleRole(u.uid, u.role)} className="fairytale-btn px-4 py-2 rounded-sm text-xs tracking-wider uppercase font-cinzel">
                      {u.role === "admin" ? "User Yap" : "Admin Yap"}
                    </button>
                    <button onClick={() => deleteUser(u.uid)} className="px-4 py-2 rounded-sm text-xs tracking-wider uppercase font-cinzel"
                      style={{ border: "1px solid #d46a6a40", color: "#d46a6a" }}>
                      ✕ Sil
                    </button>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <p className="text-center font-cormorant py-12" style={{ color: "#8b7a6b" }}>✦ Kullanıcı bulunamadı</p>
              )}
            </div>
          </div>
        )}

        {tab === "ilanlar" && (
          <div>
            <input
              type="text"
              placeholder="✦ İlan ara..."
              value={searchListing}
              onChange={(e) => setSearchListing(e.target.value)}
              className="fairytale-input w-full mb-6 px-5 py-4 rounded-sm font-cormorant placeholder:text-[#b09a8a]/50"
            />
            <div className="space-y-3">
              {filteredListings.map(l => (
                <div key={l.id} className="fairytale-card rounded-sm p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-playfair text-base font-semibold" style={{ color: "#5a2a3a" }}>{l.title}</p>
                    <p className="font-cormorant text-sm" style={{ color: "#8b7a6b" }}>{l.company} · {l.type} · {l.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/ilan/${l.id}`} className="fairytale-btn px-4 py-2 rounded-sm text-xs tracking-wider uppercase font-cinzel text-center">
                      ✦ Gör
                    </Link>
                    <button onClick={() => deleteListing(l.id)} className="px-4 py-2 rounded-sm text-xs tracking-wider uppercase font-cinzel"
                      style={{ border: "1px solid #d46a6a40", color: "#d46a6a" }}>
                      ✕ Sil
                    </button>
                  </div>
                </div>
              ))}
              {filteredListings.length === 0 && (
                <p className="text-center font-cormorant py-12" style={{ color: "#8b7a6b" }}>✦ İlan bulunamadı</p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
