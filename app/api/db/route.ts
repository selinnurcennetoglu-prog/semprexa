import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { action, id, data: updateData, filters, uid, role } = await req.json();

    if (action === "getProducts") {
      let query = supabase.from("products").select("*").order("created_at", { ascending: false });
      if (filters?.category && filters.category !== "Tümü") {
        query = query.eq("category", filters.category);
      }
      const { data, error } = await query;
      if (error) return NextResponse.json({ error: error.message });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let results = (data || []).map((p: any) => ({
        id: p.id, name: String(p.name), description: String(p.description || ""), price: Number(p.price),
        category: String(p.category), image: String(p.image || ""), stock: Number(p.stock), featured: Boolean(p.featured), createdAt: p.created_at,
      }));
      if (filters?.search) {
        const s = filters.search.toLowerCase();
        results = results.filter((p) => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
      }
      return NextResponse.json({ data: results });
    }

    if (action === "getProduct") {
      const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
      if (error || !data) return NextResponse.json({ data: null });
      return NextResponse.json({ data: {
        id: data.id, name: data.name, description: data.description, price: data.price,
        category: data.category, image: data.image, stock: data.stock, featured: data.featured, createdAt: data.created_at,
      }});
    }

    if (action === "createProduct") {
      const { data: result, error } = await supabase.from("products").insert({
        name: updateData.name, description: updateData.description, price: updateData.price,
        category: updateData.category, image: updateData.image, stock: updateData.stock, featured: updateData.featured,
        created_at: new Date().toISOString(),
      }).select("id").single();
      if (error) return NextResponse.json({ error: error.message });
      return NextResponse.json({ id: result.id });
    }

    if (action === "deleteProduct") {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) return NextResponse.json({ error: error.message });
      return NextResponse.json({ ok: true });
    }

    if (action === "getUsers") {
      const { data, error } = await supabase.from("users").select("*");
      if (error) return NextResponse.json({ data: [] });
      return NextResponse.json({ data });
    }

    if (action === "deleteUser") {
      const { error } = await supabase.from("users").delete().eq("uid", uid);
      if (error) return NextResponse.json({ error: error.message });
      return NextResponse.json({ ok: true });
    }

    if (action === "updateUserRole") {
      const { error } = await supabase.from("users").update({ role }).eq("uid", uid);
      if (error) return NextResponse.json({ error: error.message });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Bilinmeyen action" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Sunucu hatası";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
