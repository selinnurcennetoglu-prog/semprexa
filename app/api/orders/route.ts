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

function generateOrderCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "SPR-";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

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
        order_code: generateOrderCode(),
        items: JSON.stringify(items),
        address: JSON.stringify(address),
        total,
        status: "pending",
        payment_method: paymentMethod || "credit_card",
        created_at: new Date().toISOString(),
      }).select("id, order_code").single();

      if (error) {
        console.error("Order create error:", error);
        return NextResponse.json({ error: "Siparis olusturulamadi." }, { status: 500 });
      }

      return NextResponse.json({ orderId: data.id, orderCode: data.order_code, success: true });
    }

    if (action === "getOrders") {
      const { role } = body;
      let query = supabaseAdmin.from("orders").select("*");

      if (role !== "admin") {
        query = query.eq("user_uid", userId);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) {
        return NextResponse.json({ data: [] });
      }

      return NextResponse.json({ data: data || [] });
    }

    if (action === "updateCargo") {
      const { data: adminCheck } = await supabaseAdmin
        .from("users").select("role").eq("uid", userId).single();
      if (!adminCheck || adminCheck.role !== "admin") {
        return NextResponse.json({ error: "Yetkiniz yok." }, { status: 403 });
      }

      const { orderId, cargoCompany, cargoTracking, cargoStatus, orderStatus } = body;
      if (!orderId) {
        return NextResponse.json({ error: "Siparis ID gerekli." }, { status: 400 });
      }

      const updateData: Record<string, string> = {};
      if (cargoCompany !== undefined) updateData.cargo_company = cargoCompany;
      if (cargoTracking !== undefined) updateData.cargo_tracking = cargoTracking;
      if (cargoStatus !== undefined) updateData.cargo_status = cargoStatus;
      if (orderStatus !== undefined) updateData.status = orderStatus;

      const { error } = await supabaseAdmin
        .from("orders").update(updateData).eq("id", orderId);

      if (error) {
        return NextResponse.json({ error: "Guncellenemedi." }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    if (action === "trackOrder") {
      const { orderCode } = body;
      if (!orderCode) {
        return NextResponse.json({ error: "Siparis kodu gerekli." }, { status: 400 });
      }

      const { data, error } = await supabaseAdmin
        .from("orders")
        .select("order_code, cargo_company, cargo_tracking, cargo_status, status, created_at, total")
        .eq("order_code", orderCode.toUpperCase())
        .single();

      if (error || !data) {
        return NextResponse.json({ error: "Siparis bulunamadi." }, { status: 404 });
      }

      return NextResponse.json({ data });
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
