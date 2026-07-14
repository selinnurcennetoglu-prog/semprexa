import { NextRequest, NextResponse } from "next/server";

async function getLivePrices(): Promise<string> {
  try {
    const [fxRes, metalRes] = await Promise.all([
      fetch("https://api.exchangerate-api.com/v4/latest/USD", { next: { revalidate: 300 } }),
      fetch("https://api.nbp.pl/api/cenyzlota?format=json", { next: { revalidate: 300 } }),
    ]);

    let prices = "";

    if (fxRes.ok) {
      const fx = await fxRes.json();
      prices += `Güncel Döviz Kurları:\n`;
      prices += `- USD/TRY: ${(fx.rates?.TRY || 38).toFixed(2)} TL\n`;
      prices += `- EUR/TRY: ${((fx.rates?.TRY || 38) / (fx.rates?.EUR || 1)).toFixed(2)} TL\n`;
      prices += `- GBP/TRY: ${((fx.rates?.TRY || 38) / (fx.rates?.GBP || 1)).toFixed(2)} TL\n`;
      prices += `- USD/EUR: ${(1 / (fx.rates?.EUR || 1)).toFixed(4)}\n`;
    }

    if (metalRes.ok) {
      const metal = await metalRes.json();
      const gold = metal[0]?.cena;
      if (gold) {
        prices += `\nAltın Fiyatları (Gram):`;
        prices += `\n- Çeyrek Altın: ~${(gold * 1.15 * 4 / 3.17).toFixed(2)} PLN ≈ hesaplama gerekli`;
        prices += `\n- Gram Altın (NBP referans): ${gold.toFixed(2)} PLN`;
      }
    }

    return prices || "Güncel fiyat verisi alınamadı.";
  } catch {
    return "Fiyat API'leri şu an erişilemez.";
  }
}

function localReply(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("merhaba") || lower.includes("selam")) {
    return "Merhaba! Ben Rexai, finansal yapay zeka asistanınız. Döviz kurları, altın fiyatları, hisse analizleri, şirket değerlemesi ve ortaklık konularında yardımcı olabilirim. Ne sormak istersiniz?";
  }
  if (lower.includes("dolar") || lower.includes("usd")) {
    return "USD/TRY kuru hakkında bilgi almak için güncel piyasa verilerini takip ediyorum. Güncel kuru öğrenmek için 'güncel fiyatlar' yazabilirsiniz. Yatırım kararlarınızı alırken Merkez Bankası verilerini de kontrol etmenizi öneririm.";
  }
  if (lower.includes("altın") || lower.includes("gold") || lower.includes("gram")) {
    return "Altın fiyatları piyasa koşullarına göre sürekli değişir. Gram altın, çeyrek, yarım ve tam altın fiyatları için güncel verileri takip edin. Altın güvenli liman olarak görülse de kısa vadeli dalgalanmalara dikkat edin.";
  }
  if (lower.includes("euro") || lower.includes("eur")) {
    return "EUR/TRY kuru, Avrupa Merkez Bankası kararları ve Türkiye ekonomisinden etkilenir. Güncel kuru 'güncel fiyatlar' diyerek öğrenebilirsiniz.";
  }
  if (lower.includes("hisse") || lower.includes("borsa") || lower.includes("bist")) {
    return "Borsa İstanbul'da işlem gören hisselerde teknik ve temel analiz yapabilirim. THYAO, GARAN, ASELS, KCHOL gibi hisseler hakkında bilgi verebilirim. Detaylı analiz için spesifik bir hisse sorun.";
  }
  if (lower.includes("şirket") || lower.includes("ortaklık") || lower.includes("ciro")) {
    return "Şirket ortaklıklarında değerlendirmeniz gerekenler: Yıllık ciro büyüklüğü, kar marjı, borç/özkaynak oranı, sektör potansiyeli ve yönetim kadrosu. Hangi sektörü merak ediyorsunuz?";
  }
  if (lower.includes("güncel fiyat") || lower.includes("fiyatlar") || lower.includes("kur")) {
    return "LIVE_PRICES";
  }
  if (lower.includes("risk") || lower.includes("güvenli")) {
    return "Yatırım temel kuralları: 1) Portföy çeşitlendirin, 2) Acil durum fonu tutun, 3) Kredi ile yatırım yapmayın, 4) Uzun vadeli düşünün, 5) Piyasa dalgalanmalarında panik yapmayın.";
  }
  if (lower.includes("teşekkür") || lower.includes("sağol")) {
    return "Rica ederim! Başka sorularınız olursa yardımcı olmaktan memnuniyet duyarım.";
  }

  return "Anlıyorum. Size bu konuda yardımcı olabilirim. Daha detaylı bilgi için şunları sorabilirsiniz:\n- Güncel döviz kurları\n- Altın fiyatları\n- Hisse analizleri\n- Şirket değerlemesi\n- Ortaklık stratejileri";
}

export async function POST(req: NextRequest) {
  let message: string;
  try {
    const body = await req.json();
    message = body.message;
  } catch {
    return NextResponse.json({ reply: "Geçersiz istek." }, { status: 400 });
  }

  const local = localReply(message);

  if (local === "LIVE_PRICES") {
    const prices = await getLivePrices();
    return NextResponse.json({ reply: prices });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_api_key_here") {
    return NextResponse.json({ reply: local });
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: `Sen Rexai adında bir finans ve ekonomi yapay zeka asistanısın. Aşağıdaki konularda uzmanlaşmışsın:

DÖVİZ KURLARI: USD/TRY, EUR/TRY, GBP/TRY kurlarını bilirsin. Güncel kurlar hakkında bilgi verebilirsin.

ALTIN: Gram altın, çeyrek, yarım, tam altın, ons altın fiyatlarını bilirsin. Altın yorumları yaparsın.

BORSA: BIST-100, BIST-30 endeksleri. THYAO, GARAN, ASELS, KCHOL, TUPRS, SISE, EREGL gibi hisseler hakkında analiz yaparsın.

ŞİRKET ANALİZİ: Ciro, kar-zarar, P/S, P/E, ROE, ROA gibi metriklerle şirket değerlemesi yaparsın.

ORTAKLIK & YATIRIM: Şirket ortaklığı, hisse alım-satımı, stratejik yatırım, M&A (birleşme & satın alma) konularında tavsiye verirsin.

Kullanıcının sorularını profesyonel, net ve Türkçe yanıtla. Kısa ve öz ol, maddeler halinde açıkla. Yatırım tavsiyesi verirken riskleri de belirt. Yanıtların 4-5 cümleyi geçmesin. Gerekirse "güncel fiyatlar" yazarak gerçek zamanlı veri iste.`
            }]
          },
          contents: [{ role: "user", parts: [{ text: message }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 400 },
        }),
      }
    );

    if (!res.ok) return NextResponse.json({ reply: local });

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return NextResponse.json({ reply: text || local });
  } catch {
    return NextResponse.json({ reply: local });
  }
}
