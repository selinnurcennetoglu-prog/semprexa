import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function verifyAuth(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  if (!token) return null;

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return null;
    return data.user.id;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await verifyAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Giris yapmaniz gerekiyor." }, { status: 401 });
    }

    const body = await req.json();
    const { action } = body;

    if (action === "createOrder") {
      const { items, address, total, paymentMethod } = body;

      if (!items || !address || !total) {
        return NextResponse.json({ error: "Eksik siparis bilgisi." }, { status: 400 });
      }

      const { data, error } = await supabaseAdmin.from("orders").insert({
        user_uid: userId,
        items: JSON.stringify(items),
        address: JSON.stringify(address),
        total,
        status: "pending",
        payment_method: paymentMethod || "credit_card",
        created_at: new Date().toISOString(),
      }).select("id").single();

      if (error) {
        console.error("Order create error:", error);
        return NextResponse.json({ error: "Siparis olusturulamadi." }, { status: 500 });
      }

      return NextResponse.json({ orderId: data.id, success: true });
    }

    if (action === "getOrders") {
      const { data, error } = await supabaseAdmin
        .from("orders")
        .select("*")
        .eq("user_uid", userId)
        .order("created_at", { ascending: false });

      if (error) {
        return NextResponse.json({ data: [] });
      }

      return NextResponse.json({ data: data || [] });
    }

    if (action === "getOrder") {
      const { orderId } = body;
      const { data, error } = await supabaseAdmin
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (error || !data) {
        return NextResponse.json({ data: null });
      }

      if (data.user_uid !== userId) {
        const { data: adminCheck } = await supabaseAdmin
          .from("users")
          .select("role")
          .eq("uid", userId)
          .single();

        if (!adminCheck || adminCheck.role !== "admin") {
          return NextResponse.json({ error: "Yetkiniz yok." }, { status: 403 });
        }
      }

      return NextResponse.json({ data });
    }

    return NextResponse.json({ error: "Bilinmeyen action" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Sunucu hatasi";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
