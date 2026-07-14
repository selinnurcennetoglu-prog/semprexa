"use client";

import { useState, useEffect } from "react";

export default function CodeVerify({ phone, onVerify }: { phone: string; onVerify: () => void }) {
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [error, setError] = useState(false);
  const [timer, setTimer] = useState(0);

  const sendCode = () => {
    const c = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedCode(c);
    setSent(true);
    setTimer(60);
    setError(false);
    alert(`Doğrulama kodunuz: ${c}\n(Gerçek uygulamada SMS olarak gönderilir)`);
  };

  useEffect(() => {
    if (timer <= 0) return;
    const t = setInterval(() => setTimer((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [timer]);

  const verify = () => {
    if (code === generatedCode) {
      onVerify();
    } else {
      setError(true);
    }
  };

  return (
    <div className="p-5 bg-royal/40 border border-gold/10 space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-cormorant text-sm text-sand/50">
          {phone} numarasına doğrulama kodu
        </span>
        <button
          onClick={sendCode}
          disabled={timer > 0}
          className="font-cormorant text-xs text-gold hover:text-gold-light disabled:text-sand/30 transition-colors"
        >
          {timer > 0 ? `${timer}s` : "Kod Gönder"}
        </button>
      </div>

      {sent && (
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="6 haneli kod"
            maxLength={6}
            className={`flex-1 px-4 py-3 bg-espresso border text-cream font-cormorant text-center tracking-[0.3em] text-lg focus:outline-none ${
              error ? "border-red-500" : "border-gold/20 focus:border-gold/40"
            }`}
          />
          <button
            onClick={verify}
            className="px-6 py-3 bg-gold text-espresso font-cinzel text-xs tracking-widest uppercase font-semibold hover:bg-gold-light transition-colors"
          >
            Onayla
          </button>
        </div>
      )}
      {error && <span className="font-cormorant text-red-400 text-xs">Kod hatalı, tekrar deneyin.</span>}
    </div>
  );
}
