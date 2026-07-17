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
    <div className="p-5 rounded-sm" style={{ background: "#0d113080", border: "1px solid #BC6CFF20" }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-4 h-4 rounded-sm flex items-center justify-center" style={{ border: `2px solid ${verified ? "#52b788" : "#BC6CFF40"}` }}>
          {verified && <span style={{ color: "#52b788", fontSize: "10px" }}>&#10003;</span>}
        </div>
        <span style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF80", fontSize: "0.9rem" }}>Robot olmadiginizi dogrulayin</span>
      </div>
      {!verified && (
        <div className="flex items-center gap-3">
          <span style={{ fontFamily: "var(--font-fuzzy)", color: "#E9CFE8", fontSize: "1.1rem" }}>
            {num1} + {num2} = ?
          </span>
          <input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-20 px-3 py-2 rounded-sm text-center outline-none"
            style={{
              background: "#111535",
              border: error ? "1px solid #FF5CA8" : "1px solid #BC6CFF30",
              color: "#E9CFE8",
              fontFamily: "var(--font-cormorant)",
            }}
          />
          <button
            onClick={check}
            className="px-4 py-2 rounded-sm"
            style={{ background: "#BC6CFF20", color: "#BC6CFF", fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "0.1em", cursor: "pointer" }}
          >
            Dogrula
          </button>
        </div>
      )}
      {verified && (
        <span style={{ fontFamily: "var(--font-cormorant)", color: "#52b788", fontSize: "0.9rem" }}>&#10003; Dogrulandi</span>
      )}
    </div>
  );
}
