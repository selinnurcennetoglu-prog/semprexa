"use client";

import { useState, useEffect } from "react";

export default function Captcha({ onVerify }: { onVerify: () => void }) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(false);
  const [verified, setVerified] = useState(false);

  const generate = () => {
    setNum1(Math.floor(Math.random() * 20) + 1);
    setNum2(Math.floor(Math.random() * 20) + 1);
    setAnswer("");
    setError(false);
  };

  useEffect(() => { generate(); }, []);

  const check = () => {
    if (Number(answer) === num1 + num2) {
      setVerified(true);
      onVerify();
    } else {
      setError(true);
      setTimeout(() => { generate(); setError(false); }, 1000);
    }
  };

  return (
    <div className="p-5 bg-royal/40 border border-gold/10">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-4 h-4 border-2 border-gold/40 rounded-sm flex items-center justify-center">
          {verified && <span className="text-gold text-xs">✓</span>}
        </div>
        <span className="font-cormorant text-sm text-sand/50">Robot olmadığını doğrulayın</span>
      </div>
      {!verified && (
        <div className="flex items-center gap-3">
          <span className="font-cormorant text-cream text-lg">
            {num1} + {num2} = ?
          </span>
          <input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className={`w-20 px-3 py-2 bg-espresso border text-cream font-cormorant text-center focus:outline-none ${
              error ? "border-red-500 animate-shake" : "border-gold/20 focus:border-gold/40"
            }`}
          />
          <button
            onClick={check}
            className="px-4 py-2 bg-gold/20 text-gold font-cormorant text-sm hover:bg-gold/30 transition-colors"
          >
            Doğrula
          </button>
        </div>
      )}
      {verified && (
        <span className="font-cormorant text-gold text-sm">✓ Doğrulandı</span>
      )}
    </div>
  );
}
