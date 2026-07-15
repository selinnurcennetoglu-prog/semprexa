import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { action, email, password, name, phone } = await req.json();

    if (action === "signup") {
      const { data: existing } = await supabase.from("users").select("uid").eq("email", email).limit(1);
      if (existing && existing.length > 0) {
        return NextResponse.json({ error: "Bu e-posta zaten kayıtlı." });
      }
      const { data, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) {
        return NextResponse.json({ error: authError.message });
      }
      if (!data.user) {
        return NextResponse.json({ error: "Kayıt başarısız." });
      }
      const profile = {
        uid: data.user.id,
        name,
        email,
        phone,
        role: "user",
        created_at: new Date().toISOString(),
        phone_verified: false,
      };
      await supabase.from("users").insert(profile);
      return NextResponse.json({ user: profile });
    }

    if (action === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return NextResponse.json({ error: error.message });
      }
      if (!data.user) {
        return NextResponse.json({ error: "Giriş başarısız." });
      }
      const { data: profile } = await supabase.from("users").select("*").eq("uid", data.user.id).single();
      return NextResponse.json({ user: profile || { uid: data.user.id, name: "", email: data.user.email, role: "user" } });
    }

    if (action === "me") {
      const authHeader = req.headers.get("authorization");
      if (!authHeader) return NextResponse.json({ user: null });
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabase.auth.getUser(token);
      if (!user) return NextResponse.json({ user: null });
      const { data: profile } = await supabase.from("users").select("*").eq("uid", user.id).single();
      return NextResponse.json({ user: profile || null });
    }

    return NextResponse.json({ error: "Bilinmeyen action" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Sunucu hatası";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
