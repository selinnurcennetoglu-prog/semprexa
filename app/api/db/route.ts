import { NextRequest, NextResponse } from "next/server";
import { createClient, Session, User } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string, limit = 30, windowMs = 60000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

function getIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

async function verifyAuth(req: NextRequest): Promise<{ user: User; session: Session | null } | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  if (!token) return null;

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return null;
    const { data: sessionData } = await supabase.auth.getSession();
    return { user: data.user, session: sessionData.session };
  } catch {
    return null;
  }
}

async function requireAdmin(req: NextRequest): Promise<{ user: User; profile: Record<string, unknown> } | NextResponse> {
  const auth = await verifyAuth(req);
  if (!auth) {
    return NextResponse.json({ error: "Giris yapmaniz gerekiyor." }, { status: 401 });
  }

  const { data: profile } = await supabaseAdmin.from("users").select("*").eq("uid", auth.user.id).single();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Yetkiniz yok." }, { status: 403 });
  }

  return { user: auth.user, profile };
}

export async function POST(req: NextRequest) {
  try {
    const ip = getIp(req);
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Cok fazla istek. Biraz bekleyin." }, { status: 429 });
    }

    const body = await req.json();
    const { action } = body;

    if (action === "getProducts" || action === "getProduct") {
      let query = supabase.from("products").select("*").order("created_at", { ascending: false });

      if (action === "getProduct" && body.id) {
        const { data, error } = await supabase.from("products").select("*").eq("id", body.id).single();
        if (error || !data) return NextResponse.json({ data: null });
        return NextResponse.json({ data: {
          id: data.id, name: data.name, description: data.description, price: data.price,
          category: data.category, image: data.image, stock: data.stock, featured: data.featured,
          sizes: Array.isArray(data.sizes) ? data.sizes : (typeof data.sizes === "string" ? JSON.parse(data.sizes || "[]") : []),
          createdAt: data.created_at,
        }});
      }

      if (body.filters?.category && body.filters.category !== "Tumü") {
        query = query.eq("category", body.filters.category);
      }

      const { data, error } = await query;
      if (error) return NextResponse.json({ error: error.message });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let results = (data || []).map((p: any) => ({
        id: p.id, name: String(p.name), description: String(p.description || ""), price: Number(p.price),
        category: String(p.category), image: String(p.image || ""), stock: Number(p.stock), featured: Boolean(p.featured),
        sizes: Array.isArray(p.sizes) ? p.sizes : (typeof p.sizes === "string" ? JSON.parse(p.sizes || "[]") : []),
        createdAt: p.created_at,
      }));

      if (body.filters?.search) {
        const s = body.filters.search.toLowerCase();
        results = results.filter((p) => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
      }

      return NextResponse.json({ data: results });
    }

    const adminAuth = await requireAdmin(req);
    if (adminAuth instanceof NextResponse) return adminAuth;

    if (action === "createProduct") {
      const { data: result, error } = await supabaseAdmin.from("products").insert({
        name: body.data.name, description: body.data.description, price: body.data.price,
        category: body.data.category, image: body.data.image, stock: body.data.stock, featured: body.data.featured,
        sizes: JSON.stringify(body.data.sizes || []),
        created_at: new Date().toISOString(),
      }).select("id").single();
      if (error) return NextResponse.json({ error: error.message });
      return NextResponse.json({ id: result.id });
    }

    if (action === "deleteProduct") {
      const { error } = await supabaseAdmin.from("products").delete().eq("id", body.id);
      if (error) return NextResponse.json({ error: error.message });
      return NextResponse.json({ ok: true });
    }

    if (action === "updateProduct") {
      const updatePayload: Record<string, unknown> = {};
      if (body.data) {
        if (body.data.name !== undefined) updatePayload.name = body.data.name;
        if (body.data.description !== undefined) updatePayload.description = body.data.description;
        if (body.data.price !== undefined) updatePayload.price = body.data.price;
        if (body.data.category !== undefined) updatePayload.category = body.data.category;
        if (body.data.image !== undefined) updatePayload.image = body.data.image;
        if (body.data.stock !== undefined) updatePayload.stock = body.data.stock;
        if (body.data.featured !== undefined) updatePayload.featured = body.data.featured;
        if (body.data.sizes !== undefined) updatePayload.sizes = JSON.stringify(body.data.sizes);
      }
      const { error } = await supabaseAdmin.from("products").update(updatePayload).eq("id", body.id);
      if (error) return NextResponse.json({ error: error.message });
      return NextResponse.json({ ok: true });
    }

    if (action === "getUsers") {
      const { data, error } = await supabaseAdmin.from("users").select("*");
      if (error) return NextResponse.json({ data: [] });
      return NextResponse.json({ data });
    }

    if (action === "deleteUser") {
      const { error } = await supabaseAdmin.from("users").delete().eq("uid", body.uid);
      if (error) return NextResponse.json({ error: error.message });
      return NextResponse.json({ ok: true });
    }

    if (action === "updateUserRole") {
      const { error } = await supabaseAdmin.from("users").update({ role: body.role }).eq("uid", body.uid);
      if (error) return NextResponse.json({ error: error.message });
      return NextResponse.json({ ok: true });
    }

    if (action === "addReview") {
      const auth = await verifyAuth(req);
      if (!auth) return NextResponse.json({ error: "Giris yapmaniz gerekiyor." }, { status: 401 });

      const { data: prof } = await supabaseAdmin.from("users").select("role").eq("uid", auth.user.id).single();
      if (!prof || prof.role !== "admin") return NextResponse.json({ error: "Yalnizca admin yorum ekleyebilir." }, { status: 403 });

      const { productId, userId, rating, comment } = body;
      const { error } = await supabaseAdmin.from("reviews").insert({
        product_id: productId, user_uid: userId || auth.user.id,
        rating: Math.min(5, Math.max(1, rating || 5)), comment: comment || "",
        created_at: new Date().toISOString(),
      });
      if (error) return NextResponse.json({ error: error.message });
      return NextResponse.json({ ok: true });
    }

    if (action === "getReviews") {
      const { data, error } = await supabaseAdmin.from("reviews").select("*").eq("product_id", body.productId).order("created_at", { ascending: false });
      if (error) return NextResponse.json({ data: [] });
      return NextResponse.json({ data: data || [] });
    }

    if (action === "sendMessage") {
      const auth = await verifyAuth(req);
      if (!auth) return NextResponse.json({ error: "Giris yapmaniz gerekiyor." }, { status: 401 });

      const { subject, message, productId } = body;
      if (!message || !message.trim()) return NextResponse.json({ error: "Mesaj bos olamaz." }, { status: 400 });

      const { data: prof } = await supabaseAdmin.from("users").select("name, email").eq("uid", auth.user.id).single();

      const { error } = await supabaseAdmin.from("messages").insert({
        user_uid: auth.user.id,
        user_name: prof?.name || "",
        user_email: prof?.email || "",
        subject: subject || "",
        message: message.trim(),
        product_id: productId || "",
        status: "pending",
        created_at: new Date().toISOString(),
      });
      if (error) return NextResponse.json({ error: "Mesaj gonderilemedi." });
      return NextResponse.json({ ok: true });
    }

    if (action === "getMessages") {
      const authAdmin = await requireAdmin(req);
      if (authAdmin instanceof NextResponse) return authAdmin;

      const { data, error } = await supabaseAdmin.from("messages").select("*").order("created_at", { ascending: false });
      if (error) return NextResponse.json({ data: [] });
      return NextResponse.json({ data: data || [] });
    }

    if (action === "replyMessage") {
      const authAdmin = await requireAdmin(req);
      if (authAdmin instanceof NextResponse) return authAdmin;

      const { messageId, reply } = body;
      if (!messageId || !reply) return NextResponse.json({ error: "Eksik bilgi." }, { status: 400 });

      const { error } = await supabaseAdmin.from("messages").update({ reply: reply.trim(), status: "replied" }).eq("id", messageId);
      if (error) return NextResponse.json({ error: "Yanit gonderilemedi." });
      return NextResponse.json({ ok: true });
    }

    if (action === "resolveMessage") {
      const authAdmin = await requireAdmin(req);
      if (authAdmin instanceof NextResponse) return authAdmin;

      const { messageId } = body;
      const { error } = await supabaseAdmin.from("messages").update({ status: "resolved" }).eq("id", messageId);
      if (error) return NextResponse.json({ error: "Guncellenemedi." });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Bilinmeyen action" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Sunucu hatasi";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
