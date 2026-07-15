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

const API = "/api/db";

async function dbPost(body: Record<string, unknown>) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function createProduct(data: Omit<Product, "id" | "createdAt">): Promise<string> {
  const json = await dbPost({ action: "createProduct", data });
  if (json.error) throw new Error(json.error);
  return json.id;
}

export async function getProducts(filters?: { category?: string; search?: string }): Promise<Product[]> {
  const json = await dbPost({ action: "getProducts", filters: filters || {} });
  return json.data || [];
}

export async function getProduct(id: string): Promise<Product | null> {
  const json = await dbPost({ action: "getProduct", id });
  return json.data || null;
}

export async function deleteProduct(id: string): Promise<void> {
  const json = await dbPost({ action: "deleteProduct", id });
  if (json.error) throw new Error(json.error);
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  const json = await dbPost({ action: "updateProduct", id, data });
  if (json.error) throw new Error(json.error);
}

export async function getUsers(): Promise<Record<string, unknown>[]> {
  const json = await dbPost({ action: "getUsers" });
  return json.data || [];
}

export async function deleteUser(uid: string): Promise<void> {
  const json = await dbPost({ action: "deleteUser", uid });
  if (json.error) throw new Error(json.error);
}

export async function updateUserRole(uid: string, role: string): Promise<void> {
  const json = await dbPost({ action: "updateUserRole", uid, role });
  if (json.error) throw new Error(json.error);
}
