"use client";

import { useTheme } from "../lib/useTheme";
import { LilySmall } from "../components/Decorations";

interface BankInfo {
  name: string;
  accountName: string;
  iban: string;
  branch: string;
}

const banks: BankInfo[] = [
  {
    name: "Garanti BBVA",
    accountName: "Emel Cennetoğlu",
    iban: "TR87 0006 7010 0000 0026 4162 88",
    branch: "",
  },
];

export default function BankInfoModal({ onClose }: { onClose: () => void }) {
  const { bg } = useTheme();

  const copyIban = (iban: string) => {
    navigator.clipboard.writeText(iban.replace(/\s/g, ""));
    alert("IBAN kopyalandı!");
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4" style={{ background: "#0B0F2Bf0", backdropFilter: "blur(8px)" }} onClick={onClose}>
      <div className="w-full max-w-lg p-6 rounded-sm max-h-[80vh] overflow-y-auto" style={{ background: "#111535", border: "1px solid #BC6CFF30" }} onClick={(e) => e.stopPropagation()}>
        <div className="text-center mb-6">
          <LilySmall className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <h2 style={{ fontFamily: "var(--font-fuzzy)", color: "#FFB86B", fontSize: "1.3rem" }}>Havale / EFT Bilgileri</h2>
          <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF60", fontSize: "0.85rem", marginTop: "4px" }}>
            Aşağıdaki hesaplara sipariş tutarını gönderin
          </p>
        </div>

        <div className="space-y-4">
          {banks.map((bank, i) => (
            <div key={i} className="p-4 rounded-sm" style={{ background: "#0d1130", border: "1px solid #BC6CFF20" }}>
              <p style={{ fontFamily: "var(--font-fuzzy)", color: "#00F0FF", fontSize: "1rem", marginBottom: "8px" }}>{bank.name}</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span style={{ fontFamily: "var(--font-cinzel)", color: "#BC6CFF80", fontSize: "9px", letterSpacing: "0.1em" }}>HESAP SAHİBİ</span>
                  <span style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8" }}>{bank.accountName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ fontFamily: "var(--font-cinzel)", color: "#BC6CFF80", fontSize: "9px", letterSpacing: "0.1em" }}>ŞUBE</span>
                  <span style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8" }}>{bank.branch}</span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span style={{ fontFamily: "var(--font-cinzel)", color: "#BC6CFF80", fontSize: "9px", letterSpacing: "0.1em", flexShrink: 0 }}>IBAN</span>
                  <div className="flex items-center gap-2">
                    <span style={{ fontFamily: "var(--font-cormorant)", color: "#FFB86B", fontSize: "0.85rem", wordBreak: "break-all" }}>{bank.iban}</span>
                    <button onClick={() => copyIban(bank.iban)} className="px-2 py-1 rounded-sm flex-shrink-0" style={{ border: "1px solid #FFB86B40", color: "#FFB86B", fontFamily: "var(--font-cinzel)", fontSize: "8px", letterSpacing: "0.05em", cursor: "pointer" }}>
                      Kopyala
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-sm" style={{ background: "#FFB86B10", border: "1px solid #FFB86B20" }}>
          <p style={{ fontFamily: "var(--font-cormorant)", color: "#FFB86B", fontSize: "0.85rem", lineHeight: 1.6 }}>
            <strong>Önemli:</strong> Havale/EFT açıklamasına <strong>sipariş kodunuzu</strong> yazmayı unutmayın.
            Ödeme onayı 1-2 iş günü içinde yapılacaktır.
          </p>
        </div>

        <button onClick={onClose} className="w-full mt-4 py-3 rounded-sm" style={{ border: "1px solid #BC6CFF40", color: "#BC6CFF", fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "0.15em", cursor: "pointer" }}>
          KAPAT
        </button>
      </div>
    </div>
  );
}
