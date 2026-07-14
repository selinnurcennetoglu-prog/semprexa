"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDocs, collection, query, where } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";

export default function AdminSetupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleCreate = async () => {
    setError("");
    if (!name || !email || !password) return setError("Tüm alanları doldurun.");
    if (password.length < 8) return setError("Şifre en az 8 karakter olmalı.");

    setLoading(true);

    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const existing = await getDocs(q);
      if (!existing.empty) {
        setError("Bu e-posta zaten kayıtlı. Giriş yapıp Firestore'dan role admin verin.");
        setLoading(false);
        return;
      }

      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });

      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        name,
        email,
        phone: "",
        role: "admin",
        createdAt: new Date().toISOString(),
        phoneVerified: true,
      });

      setDone(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Hata";
      if (msg.includes("email-already-in-use")) setError("Bu e-posta zaten kayıtlı.");
      else if (msg.includes("weak-password")) setError("Şifre çok zayıf.");
      else setError(msg);
    }

    setLoading(false);
  };

  if (done) {
    return (
      <main className="min-h-screen bg-cream pt-24 pb-16 px-6 flex items-center justify-center">
        <div className="max-w-lg text-center">
          <div className="text-5xl mb-6">👑</div>
          <h1 className="font-playfair text-3xl font-bold text-coffee-dark mb-4">
            Admin Hesabı <span className="text-gold">Oluşturuldu!</span>
          </h1>
          <p className="font-cormorant text-taupe mb-8">
            Artık admin olarak giriş yapabilirsiniz.
          </p>
          <Link href="/admin/giris" className="inline-block px-8 py-4 bg-gold text-espresso font-cinzel text-xs tracking-[0.25em] uppercase font-semibold hover:bg-gold-light transition-all">
            Admin Girişi
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream pt-24 pb-16 px-6">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-12">
          <span className="font-cinzel text-[10px] tracking-[0.5em] uppercase text-gold-dark/60 block mb-3">İlk Kurulum</span>
          <h1 className="font-playfair text-4xl font-bold text-coffee-dark">
            Admin <span className="text-gold">Hesabı Oluştur</span>
          </h1>
          <p className="font-cormorant text-sm text-taupe mt-3">Bu sayfa sadece bir kez kullanılabilir.</p>
        </div>

        <div className="royal-frame p-8 bg-cream/80 space-y-6">
          <input type="text" placeholder="Admin Adı" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-5 py-4 bg-cream border border-gold/15 text-coffee-dark font-cormorant text-base placeholder:text-taupe/40 focus:outline-none focus:border-gold/40 transition-colors" />
          <input type="email" placeholder="Admin E-posta" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-5 py-4 bg-cream border border-gold/15 text-coffee-dark font-cormorant text-base placeholder:text-taupe/40 focus:outline-none focus:border-gold/40 transition-colors" />
          <input type="password" placeholder="Admin Şifresi (en az 8 karakter)" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleCreate()} className="w-full px-5 py-4 bg-cream border border-gold/15 text-coffee-dark font-cormorant text-base placeholder:text-taupe/40 focus:outline-none focus:border-gold/40 transition-colors" />

          {error && <p className="font-cormorant text-sm text-red-500 text-center">{error}</p>}

          <button onClick={handleCreate} disabled={loading} className="w-full py-4 bg-gold text-espresso font-cinzel text-xs tracking-[0.25em] uppercase font-semibold hover:bg-gold-light transition-all disabled:opacity-50">
            {loading ? "Oluşturuluyor..." : "Admin Hesabı Oluştur"}
          </button>
        </div>

        <p className="text-center mt-8 font-cormorant text-sm text-taupe">
          <Link href="/admin/giris" className="text-gold-dark hover:text-gold transition-colors">Admin Girişi</Link>
        </p>
      </div>
    </main>
  );
}
