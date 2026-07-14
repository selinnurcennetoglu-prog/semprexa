"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { getListing, getOrCreateChatRoom, type Listing } from "../../lib/db";

export default function IlanDetayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [user, setUser] = useState<{ uid: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getListing(id).then((l) => { setListing(l); setLoading(false); });
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) setUser({ uid: u.uid, name: u.displayName || "" });
    });
    return () => unsub();
  }, [id]);

  const handleContact = async () => {
    if (!user || !listing) return alert("Mesaj göndermek için giriş yapmalısınız.");
    if (user.uid === listing.ownerUid) return alert("Kendi ilanınıza mesaj gönderemezsiniz.");

    const chatId = await getOrCreateChatRoom(
      user.uid, user.name,
      listing.ownerUid, listing.ownerName,
      listing.id, listing.title
    );
    router.push(`/mesajlar/${chatId}`);
  };

  if (loading) return <main className="min-h-screen bg-cream pt-24 pb-16 px-6 flex items-center justify-center"><span className="text-gold text-3xl animate-pulse">♛</span></main>;

  if (!listing) return (
    <main className="min-h-screen bg-cream pt-24 pb-16 px-6 flex items-center justify-center">
      <div className="text-center">
        <span className="text-gold text-4xl">♛</span>
        <p className="font-cormorant text-taupe mt-4">İlan bulunamadı.</p>
        <Link href="/ilanlar" className="font-cormorant text-gold-dark hover:text-gold mt-4 inline-block">← İlanlara Dön</Link>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-cream pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/ilanlar" className="font-cormorant text-sm text-gold-dark hover:text-gold transition-colors inline-flex items-center gap-2 mb-8">← İlanlara Dön</Link>

        <div className="royal-frame p-8 md:p-12 bg-cream/80">
          <div className="flex items-start justify-between mb-6">
            <div>
              <span className="px-3 py-1 bg-gold/15 text-gold text-[10px] tracking-widest uppercase font-cinzel">{listing.type}</span>
              {listing.aiApproved && <span className="ml-3 text-[10px] text-gold/50 font-cormorant">✓ Rexai Onaylı</span>}
            </div>
            <span className="font-cormorant text-xs text-taupe">{listing.date}</span>
          </div>

          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-coffee-dark mb-6">{listing.title}</h1>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8 py-6 border-y border-gold/10">
            <div><span className="font-cinzel text-[10px] tracking-widest uppercase text-taupe/50 block mb-1">Şirket</span><span className="font-cormorant text-lg text-coffee-dark font-semibold">{listing.company}</span></div>
            <div><span className="font-cinzel text-[10px] tracking-widest uppercase text-taupe/50 block mb-1">Yıllık Ciro</span><span className="font-cormorant text-lg text-coffee-dark font-semibold">{listing.ciro}</span></div>
            <div><span className="font-cinzel text-[10px] tracking-widest uppercase text-taupe/50 block mb-1">Fiyat</span><span className="font-cormorant text-lg text-gold-dark font-semibold">{listing.price}</span></div>
          </div>

          <div className="mb-8">
            <h2 className="font-cinzel text-[10px] tracking-widest uppercase text-taupe/50 mb-3">Detaylar</h2>
            <p className="font-cormorant text-base text-coffee leading-relaxed">{listing.desc}</p>
          </div>

          <div className="mb-8 p-6 bg-royal/5 border border-gold/10">
            <h2 className="font-cinzel text-[10px] tracking-widest uppercase text-taupe/50 mb-2">İletişim</h2>
            <p className="font-cormorant text-lg text-coffee-dark">{listing.phone}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={handleContact} className="flex-1 py-4 bg-gold text-espresso font-cinzel text-xs tracking-[0.25em] uppercase font-semibold hover:bg-gold-light transition-all">Mesaj Gönder</button>
            <a href={`tel:${listing.phone.replace(/\s/g, "")}`} className="flex-1 py-4 border border-gold/30 text-gold-dark font-cinzel text-xs tracking-[0.25em] uppercase text-center hover:border-gold hover:bg-gold/5 transition-all">Hemen Ara</a>
          </div>
        </div>
      </div>
    </main>
  );
}
