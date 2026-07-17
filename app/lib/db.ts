import { getAccessToken } from "./auth";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  featured: boolean;
  sizes: string[];
  createdAt: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_uid: string;
  rating: number;
  comment: string;
  created_at: string;
}

const API = "/api/db";

async function dbPost(body: Record<string, unknown>, requireAuth = false) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getAccessToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else if (requireAuth) {
    throw new Error("Giris yapmaniz gerekiyor.");
  }

  const res = await fetch(API, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function createProduct(data: Omit<Product, "id" | "createdAt">): Promise<string> {
  const json = await dbPost({ action: "createProduct", data }, true);
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
  const json = await dbPost({ action: "deleteProduct", id }, true);
  if (json.error) throw new Error(json.error);
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  const json = await dbPost({ action: "updateProduct", id, data }, true);
  if (json.error) throw new Error(json.error);
}

export async function getUsers(): Promise<Record<string, unknown>[]> {
  const json = await dbPost({ action: "getUsers" }, true);
  return json.data || [];
}

export async function deleteUser(uid: string): Promise<void> {
  const json = await dbPost({ action: "deleteUser", uid }, true);
  if (json.error) throw new Error(json.error);
}

export async function updateUserRole(uid: string, role: string): Promise<void> {
  const json = await dbPost({ action: "updateUserRole", uid, role }, true);
  if (json.error) throw new Error(json.error);
}

export async function addReview(productId: string, userId: string, rating: number, comment: string): Promise<void> {
  const json = await dbPost({ action: "addReview", productId, userId, rating, comment }, true);
  if (json.error) throw new Error(json.error);
}

export async function getReviews(productId: string): Promise<Review[]> {
  const json = await dbPost({ action: "getReviews", productId });
  return json.data || [];
}

export interface Message {
  id: string;
  user_uid: string;
  user_name: string;
  user_email: string;
  subject: string;
  message: string;
  reply: string;
  status: string;
  product_id: string;
  created_at: string;
}

export async function sendMessage(subject: string, message: string, productId?: string): Promise<void> {
  const json = await dbPost({ action: "sendMessage", subject, message, productId }, true);
  if (json.error) throw new Error(json.error);
}

export async function getMessages(): Promise<Message[]> {
  const json = await dbPost({ action: "getMessages" }, true);
  return json.data || [];
}

export async function replyMessage(messageId: string, reply: string): Promise<void> {
  const json = await dbPost({ action: "replyMessage", messageId, reply }, true);
  if (json.error) throw new Error(json.error);
}

export async function resolveMessage(messageId: string): Promise<void> {
  const json = await dbPost({ action: "resolveMessage", messageId }, true);
  if (json.error) throw new Error(json.error);
}
