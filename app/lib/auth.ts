import { supabase } from "./supabase";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  phoneVerified: boolean;
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  phone: string
): Promise<{ user: UserProfile | null; error?: string }> {
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      if (error.message.includes("already")) return { user: null, error: "Bu e-posta zaten kayıtlı." };
      return { user: null, error: error.message };
    }
    if (!data.user) return { user: null, error: "Kayıt başarısız." };

    const profile: UserProfile = {
      uid: data.user.id,
      name,
      email,
      phone,
      role: "user",
      createdAt: new Date().toISOString(),
      phoneVerified: false,
    };

    await supabase.from("users").insert(profile);
    return { user: profile };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Bilinmeyen hata";
    return { user: null, error: msg };
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ user: UserProfile | null; error?: string }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.includes("Invalid")) return { user: null, error: "E-posta veya şifre hatalı." };
      return { user: null, error: error.message };
    }
    if (!data.user) return { user: null, error: "Giriş başarısız." };

    const { data: profile } = await supabase.from("users").select("*").eq("uid", data.user.id).single();
    if (profile) return { user: profile as UserProfile };

    return {
      user: {
        uid: data.user.id,
        name: data.user.user_metadata?.name || "",
        email: data.user.email || "",
        phone: "",
        role: "user",
        createdAt: "",
        phoneVerified: false,
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Bilinmeyen hata";
    return { user: null, error: msg };
  }
}

export async function logoutUser(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("users").select("*").eq("uid", user.id).single();
  return (profile as UserProfile) || null;
}

export async function onAuthChange(callback: (user: UserProfile | null) => void): Promise<() => void> {
  const { data: { subscription } } = await supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session?.user) {
      const { data: profile } = await supabase.from("users").select("*").eq("uid", session.user.id).single();
      callback(profile as UserProfile || null);
    } else {
      callback(null);
    }
  });
  return () => subscription.unsubscribe();
}
