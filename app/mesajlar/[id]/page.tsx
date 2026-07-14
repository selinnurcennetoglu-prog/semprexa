"use client";

import { use, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { sendMessage, subscribeToMessages, type ChatMessage, type ChatRoom } from "../../lib/db";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [user, setUser] = useState<{ uid: string; name: string } | null>(null);
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) setUser({ uid: u.uid, name: u.displayName || "" });
      else setUser(null);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    const ref = doc(db, "chats", id);
    getDoc(ref).then((snap) => {
      if (snap.exists()) {
        const data = snap.data() as ChatRoom;
        if (!data.participants.includes(user.uid)) {
          setLoading(false);
          return;
        }
        setChatRoom(data);
      }
      setLoading(false);
    });
  }, [id, user]);

  useEffect(() => {
    if (!chatRoom) return;
    const unsub = subscribeToMessages(id, (msgs) => setMessages(msgs));
    return () => unsub();
  }, [id, chatRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !user || !chatRoom) return;
    const now = new Date();
    const time = now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
    await sendMessage(id, { fromUid: user.uid, fromName: user.name, text: input, time });
    setInput("");
  };

  if (loading) return <main className="min-h-screen bg-cream pt-24 pb-16 px-6 flex items-center justify-center"><span className="text-gold text-3xl animate-pulse">♛</span></main>;

  if (!user || !chatRoom) return (
    <main className="min-h-screen bg-cream pt-24 pb-16 px-6 flex items-center justify-center">
      <div className="text-center">
        <span className="text-gold text-4xl">♛</span>
        <p className="font-cormorant text-taupe mt-4">Sohbet bulunamadı.</p>
        <Link href="/mesajlar" className="font-cormorant text-gold-dark hover:text-gold mt-4 inline-block">← Mesajlara Dön</Link>
      </div>
    </main>
  );

  const otherIdx = chatRoom.participants.indexOf(user.uid) === 0 ? 1 : 0;
  const otherName = chatRoom.participantNames[otherIdx] || "Bilinmeyen";

  return (
    <main className="min-h-screen bg-cream pt-20 pb-0 flex flex-col">
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col px-4">
        <div className="py-4 border-b border-gold/10 flex items-center gap-4">
          <Link href="/mesajlar" className="font-cormorant text-gold-dark hover:text-gold text-sm">← Geri</Link>
          <div>
            <span className="font-playfair text-base font-semibold text-coffee-dark">{otherName}</span>
            <span className="ml-2 font-cormorant text-xs text-taupe/50">— {chatRoom.listingTitle}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-4 min-h-[50vh]">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <span className="text-gold text-2xl">♛</span>
              <p className="font-cormorant text-taupe/50 text-sm mt-2">İlk mesajı gönderin.</p>
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.fromUid === user.uid ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] px-5 py-3 font-cormorant text-sm leading-relaxed ${m.fromUid === user.uid ? "bg-gold/15 text-coffee-dark border border-gold/10" : "bg-espresso/5 text-coffee border border-gold/5"}`}>
                <p>{m.text}</p>
                <span className="block text-[10px] mt-1 opacity-40">{m.time}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="py-4 border-t border-gold/10">
          <div className="flex gap-3">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder="Mesajınızı yazın..." className="flex-1 px-5 py-3 bg-cream border border-gold/15 text-coffee-dark font-cormorant placeholder:text-taupe/40 focus:outline-none focus:border-gold/40 transition-colors" />
            <button onClick={handleSend} className="px-6 py-3 bg-gold text-espresso font-cinzel text-xs tracking-widest uppercase font-semibold hover:bg-gold-light transition-all">Gönder</button>
          </div>
          <p className="font-cormorant text-[10px] text-taupe/30 mt-2 text-center">Bu sohbet sadece size ve karşı tarafın erişimine açıktır.</p>
        </div>
      </div>
    </main>
  );
}
