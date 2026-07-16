import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string, maxAttempts = 5, windowMs = 300000): { ok: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: maxAttempts - 1 };
  }

  if (entry.count >= maxAttempts) {
    return { ok: false, remaining: 0 };
  }

  entry.count++;
  return { ok: true, remaining: maxAttempts - entry.count };
}

function getIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

function sanitizeInput(s: string): string {
  return s.replace(/[<>"'`]/g, "").trim().slice(0, 254);
}

export async function POST(req: NextRequest) {
  try {
    const ip = getIp(req);
    const body = await req.json();
    const { action } = body;

    if (action === "login") {
      const rl = checkRateLimit(`login:${ip}`, 5, 300000);
      if (!rl.ok) {
        return NextResponse.json({ error: "Cok fazla basarisiz deneme. 5 dakika bekleyin." }, { status: 429 });
      }

      const email = sanitizeInput(body.email || "");
      const password = body.password || "";

      if (!email || !password) {
        return NextResponse.json({ error: "E-posta ve sifre gerekli." });
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        const msg = error.message.includes("Invalid login")
          ? "E-posta veya sifre hatali."
          : error.message.includes("Email not confirmed")
            ? "E-posta adresinizi dogrulayin. Gelen kutunuzu kontrol edin."
            : error.message;
        return NextResponse.json({ error: msg });
      }
      if (!data.user || !data.session) {
        return NextResponse.json({ error: "Giris basarisiz." });
      }

      rateLimitMap.delete(`login:${ip}`);

      const { data: profile } = await supabase.from("users").select("*").eq("uid", data.user.id).single();
      if (!profile) {
        const fallback = {
          uid: data.user.id, name: "", email: data.user.email || email, phone: "",
          role: "user", created_at: new Date().toISOString(), phone_verified: false,
        };
        await supabase.from("users").insert(fallback);
        return NextResponse.json({ user: fallback, access_token: data.session.access_token, refresh_token: data.session.refresh_token });
      }

      return NextResponse.json({ user: profile, access_token: data.session.access_token, refresh_token: data.session.refresh_token });
    }

    if (action === "signup") {
      const rl = checkRateLimit(`signup:${ip}`, 3, 3600000);
      if (!rl.ok) {
        return NextResponse.json({ error: "Cok fazla kayit denemesi. 1 saat bekleyin." }, { status: 429 });
      }

      const email = sanitizeInput(body.email || "");
      const password = body.password || "";
      const name = sanitizeInput(body.name || "");
      const phone = sanitizeInput(body.phone || "");

      if (!email || !password || !name) {
        return NextResponse.json({ error: "Tum alanlar gerekli." });
      }

      if (password.length < 8) {
        return NextResponse.json({ error: "Sifre en az 8 karakter olmali." });
      }
      if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
        return NextResponse.json({ error: "Sifre buyuk harf, kucuk harf ve rakam icermeli." });
      }

      const { data: existing } = await supabase.from("users").select("uid").eq("email", email).limit(1);
      if (existing && existing.length > 0) {
        return NextResponse.json({ error: "Bu e-posta zaten kayitli." });
      }

      const { data, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) {
        return NextResponse.json({ error: authError.message });
      }
      if (!data.user) {
        return NextResponse.json({ error: "Kayit basarisiz." });
      }

      const profile = {
        uid: data.user.id, name, email, phone, role: "user",
        created_at: new Date().toISOString(), phone_verified: false,
      };
      await supabase.from("users").insert(profile);

      if (data.session) {
        return NextResponse.json({
          user: profile, access_token: data.session.access_token, refresh_token: data.session.refresh_token,
          message: "Kayit basarili! E-posta adresinizi dogrulayin.",
        });
      }

      return NextResponse.json({
        user: profile, message: "Kayit basarili! E-posta adresinize dogrulama linki gonderildi. Lutfen e-postanizi dogrulayin.",
        requiresVerification: true,
      });
    }

    if (action === "me") {
      const { token } = body;
      if (!token) return NextResponse.json({ user: null });

      const { data: { user }, error: getUserErr } = await supabase.auth.getUser(token);
      if (getUserErr || !user) return NextResponse.json({ user: null });

      const { data: profile } = await supabase.from("users").select("*").eq("uid", user.id).single();
      return NextResponse.json({ user: profile || null });
    }

    if (action === "refresh") {
      const { refresh_token } = body;
      if (!refresh_token) return NextResponse.json({ error: "Refresh token gerekli." });

      const { data, error } = await supabase.auth.refreshSession({ refresh_token });
      if (error || !data.session) {
        return NextResponse.json({ error: "Oturum suresi dolmus." });
      }

      return NextResponse.json({
        access_token: data.session.access_token, refresh_token: data.session.refresh_token,
      });
    }

    return NextResponse.json({ error: "Bilinmeyen action" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Sunucu hatasi";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
