import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  doc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "./firebase";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  featured: boolean;
  createdAt: Timestamp;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  phoneVerified: boolean;
}

async function requireAdmin(): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error("Giriş yapmalısınız.");
  const snap = await getDoc(doc(db, "users", user.uid));
  if (!snap.exists() || snap.data().role !== "admin") throw new Error("Yetkiniz yok.");
}

export async function createProduct(data: Omit<Product, "id" | "createdAt">): Promise<string> {
  await requireAdmin();
  const docRef = await addDoc(collection(db, "products"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getProducts(filters?: { category?: string; search?: string }): Promise<Product[]> {
  let q = query(collection(db, "products"), orderBy("createdAt", "desc"));
  if (filters?.category && filters.category !== "Tümü") {
    q = query(q, where("category", "==", filters.category));
  }
  const snap = await getDocs(q);
  let results = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    results = results.filter(
      (p) => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s)
    );
  }
  return results;
}

export async function getProduct(id: string): Promise<Product | null> {
  const snap = await getDoc(doc(db, "products", id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Product) : null;
}

export async function deleteProduct(id: string): Promise<void> {
  await requireAdmin();
  await deleteDoc(doc(db, "products", id));
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  await requireAdmin();
  await setDoc(doc(db, "products", id), data, { merge: true });
}
