import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { to, code } = await req.json();

  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;

  if (!sid || !token || !from) {
    return NextResponse.json({ error: "Twilio ayarları tanımlanmamış.", ok: false }, { status: 500 });
  }

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
    const body = new URLSearchParams({
      To: to,
      From: from,
      Body: `[Semprexa] Doğrulama kodunuz: ${code}. Bu kodu kimseyle paylaşmayın.`,
    });

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Twilio error:", err);
      return NextResponse.json({ error: "SMS gönderilemedi.", ok: false }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Twilio fetch error:", err);
    return NextResponse.json({ error: "Bağlantı hatası.", ok: false }, { status: 500 });
  }
}
