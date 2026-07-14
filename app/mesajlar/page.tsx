"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { getUserChats, type ChatRoom } from "../lib/db";

export default function MesajlarPage() {
  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [user, setUser] = useState<{ uid: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser({ uid: u.uid });
        getUserChats(u.uid).then((c) => { setChats(c); setLoading(false); });
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  if (loading) return <main className="min-h-screen bg-cream pt-24 pb-16 px-6 flex items-center justify-center"><span className="text-gold text-3xl animate-pulse">♛</span></main>;

  if (!user) return (
    <main className="min-h-screen bg-cream pt-24 pb-16 px-6 flex items-center justify-center">
      <div className="text-center">
        <span className="text-gold text-4xl">♛</span>
        <p className="font-cormorant text-taupe mt-4">Giriş yapmalısınız.</p>
        <Link href="/giris" className="font-cormorant text-gold-dark hover:text-gold mt-4 inline-block">Giriş Yapın →</Link>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-cream pt-24 pb-16 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <span className="font-cinzel text-[10px] tracking-[0.5em] uppercase text-gold-dark/60 block mb-3">Özel Alan</span>
          <h1 className="font-playfair text-4xl font-bold text-coffee-dark"><span className="text-gold">Mesajlarınız</span></h1>
        </div>

        {chats.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-gold text-4xl">♛</span>
            <p className="font-cormorant text-taupe mt-4">Henüz mesajınız yok.</p>
            <Link href="/ilanlar" className="mt-6 inline-block px-8 py-3 bg-gold text-espresso font-cinzel text-xs tracking-widest uppercase font-semibold hover:bg-gold-light transition-all">İlanlara Göz At</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {chats.map((chat) => {
              const otherIdx = chat.participants.indexOf(user.uid) === 0 ? 1 : 0;
              const otherName = chat.participantNames[otherIdx] || "Bilinmeyen";
              return (
                <Link key={chat.id} href={`/mesajlar/${chat.id}`}>
                  <div className="royal-frame p-5 bg-cream/80 hover:bg-cream transition-all cursor-pointer group">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-playfair text-base font-semibold text-coffee-dark group-hover:text-gold-dark transition-colors">{otherName}</span>
                      {chat.lastMessageTime && <span className="font-cormorant text-[10px] text-taupe/40">{chat.lastMessageTime}</span>}
                    </div>
                    <span className="font-cormorant text-xs text-taupe/50">({chat.listingTitle})</span>
                    {chat.lastMessage && <p className="font-cormorant text-sm text-taupe line-clamp-1 mt-2">{chat.lastMessage}</p>}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
