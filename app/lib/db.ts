import { supabase } from "./supabase";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  featured: boolean;
  createdAt: string;
}

async function requireAdmin(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Giriş yapmalısınız.");
  const { data } = await supabase.from("users").select("role").eq("uid", user.id).single();
  if (!data || data.role !== "admin") throw new Error("Yetkiniz yok.");
}

export async function createProduct(data: Omit<Product, "id" | "createdAt">): Promise<string> {
  await requireAdmin();
  const { data: result, error } = await supabase.from("products").insert({ ...data, created_at: new Date().toISOString() }).select("id").single();
  if (error) throw error;
  return result.id;
}

export async function getProducts(filters?: { category?: string; search?: string }): Promise<Product[]> {
  let query = supabase.from("products").select("*").order("created_at", { ascending: false });
  if (filters?.category && filters.category !== "Tümü") {
    query = query.eq("category", filters.category);
  }
  const { data, error } = await query;
  if (error) return [];
  let results = (data || []).map((p: Record<string, unknown>) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    category: p.category,
    image: p.image,
    stock: p.stock,
    featured: p.featured,
    createdAt: p.created_at,
  })) as Product[];
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    results = results.filter((p) => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
  }
  return results;
}

export async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
  if (error || !data) return null;
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price,
    category: data.category,
    image: data.image,
    stock: data.stock,
    featured: data.featured,
    createdAt: data.created_at,
  };
}

export async function deleteProduct(id: string): Promise<void> {
  await requireAdmin();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  await requireAdmin();
  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.price !== undefined) updateData.price = data.price;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.image !== undefined) updateData.image = data.image;
  if (data.stock !== undefined) updateData.stock = data.stock;
  if (data.featured !== undefined) updateData.featured = data.featured;
  const { error } = await supabase.from("products").update(updateData).eq("id", id);
  if (error) throw error;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;
  phone_verified: boolean;
}

export async function getUsers(): Promise<UserProfile[]> {
  const { data, error } = await supabase.from("users").select("*");
  if (error) return [];
  return (data || []) as UserProfile[];
}

export async function deleteUser(uid: string): Promise<void> {
  await requireAdmin();
  const { error } = await supabase.from("users").delete().eq("uid", uid);
  if (error) throw error;
}

export async function updateUserRole(uid: string, role: string): Promise<void> {
  await requireAdmin();
  const { error } = await supabase.from("users").update({ role }).eq("uid", uid);
  if (error) throw error;
}
