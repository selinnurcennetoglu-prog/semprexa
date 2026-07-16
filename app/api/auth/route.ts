import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "signup") {
      const { email, password, name, phone } = body;

      const { data: existing } = await supabase.from("users").select("uid").eq("email", email).limit(1);
      if (existing && existing.length > 0) {
        return NextResponse.json({ error: "Bu e-posta zaten kayitli." });
      }

      const { data, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) {
        return NextResponse.json({ error: authError.message });
      }
      if (!data.user || !data.session) {
        return NextResponse.json({ error: "Kayit basarisiz. E-posta adresinizi kontrol edin." });
      }

      const profile = {
        uid: data.user.id,
        name: name || "",
        email,
        phone: phone || "",
        role: "user",
        created_at: new Date().toISOString(),
        phone_verified: false,
      };

      await supabase.from("users").insert(profile);

      return NextResponse.json({
        user: profile,
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });
    }

    if (action === "login") {
      const { email, password } = body;

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return NextResponse.json({ error: error.message });
      }
      if (!data.user || !data.session) {
        return NextResponse.json({ error: "Giris basarisiz." });
      }

      const { data: profile } = await supabase.from("users").select("*").eq("uid", data.user.id).single();

      if (!profile) {
        const fallback = {
          uid: data.user.id,
          name: "",
          email: data.user.email || email,
          phone: "",
          role: "user",
          created_at: new Date().toISOString(),
          phone_verified: false,
        };
        await supabase.from("users").insert(fallback);
        return NextResponse.json({
          user: fallback,
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
      }

      return NextResponse.json({
        user: profile,
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
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
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });
    }

    return NextResponse.json({ error: "Bilinmeyen action" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Sunucu hatasi";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
