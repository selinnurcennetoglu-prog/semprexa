"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export default function AiWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: "ai", text: "Merhaba! Ben Rexai, yapay zeka finans asistanınız. Size nasıl yardımcı olabilirim?" },
  ]);
  const [input, setInput] = useState("");

  const [offset, setOffset] = useState({ dx: 0, dy: 0 });
  const dragRef = useRef({ active: false, didMove: false, startX: 0, startY: 0, startDx: 0, startDy: 0 });
  const msgEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d.active) return;
      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) d.didMove = true;
      setOffset({ dx: d.startDx + dx, dy: d.startDy + dy });
    };
    const onUp = () => { dragRef.current.active = false; };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  const handleDown = (e: React.PointerEvent) => {
    dragRef.current = { active: true, didMove: false, startX: e.clientX, startY: e.clientY, startDx: offset.dx, startDy: offset.dy };
  };

  const handleClick = () => {
    if (!dragRef.current.didMove) setOpen((v) => !v);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", text: data.reply || "Yanıt alınamadı." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", text: "Bağlantı hatası. Lütfen tekrar deneyin." }]);
    }
  };

  const bubbleRight = 24 - offset.dx;
  const bubbleBottom = 24 - offset.dy;

  const panelRight = Math.max(16, Math.min(bubbleRight, (typeof window !== "undefined" ? window.innerWidth : 1200) - 396));
  const panelBottom = Math.max(16, Math.min(bubbleBottom + 80, (typeof window !== "undefined" ? window.innerHeight : 900) - 536));

  return (
    <>
      <div
        onPointerDown={handleDown}
        onClick={handleClick}
        className="fixed z-[999] w-16 h-16 rounded-full bg-gradient-to-br from-gold to-gold-dark shadow-lg shadow-gold/30 flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none hover:shadow-xl hover:shadow-gold/40 transition-shadow"
        style={{ right: bubbleRight, bottom: bubbleBottom }}
      >
        <span className="text-espresso text-2xl font-bold pointer-events-none">♛</span>
      </div>

      {open && (
        <div
          className="fixed z-[998] w-[380px] max-w-[calc(100vw-2rem)] h-[520px] bg-espresso border border-gold/20 shadow-2xl shadow-black/40 flex flex-col"
          style={{ right: panelRight, bottom: panelBottom }}
        >
          <div className="px-5 py-4 border-b border-gold/15 flex items-center gap-3 bg-royal/40 shrink-0">
            <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="font-cinzel text-xs tracking-[0.2em] text-gold uppercase">Rexai Asistan</span>
            <button onClick={() => setOpen(false)} className="ml-auto text-sand/30 hover:text-gold text-lg transition-colors">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-4 py-3 font-cormorant text-sm leading-relaxed ${
                  m.role === "user" ? "bg-gold/15 text-cream border border-gold/10" : "bg-royal/50 text-sand/70 border border-gold/5"
                }`}>{m.text}</div>
              </div>
            ))}
            <div ref={msgEndRef} />
          </div>

          <div className="p-3 border-t border-gold/15 shrink-0">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Mesajınızı yazın..."
                className="flex-1 px-4 py-3 bg-royal/40 border border-gold/10 text-cream font-cormorant text-sm placeholder:text-sand/25 focus:outline-none focus:border-gold/30"
              />
              <button onClick={sendMessage} className="px-4 py-3 bg-gold text-espresso font-cinzel text-xs font-semibold hover:bg-gold-light transition-colors shrink-0">
                Gönder
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
