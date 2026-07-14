import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./firebase";

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
): Promise<{ user: UserProfile; error?: string }> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });

    const profile: UserProfile = {
      uid: cred.user.uid,
      name,
      email,
      phone,
      role: "user",
      createdAt: new Date().toISOString(),
      phoneVerified: false,
    };

    await setDoc(doc(db, "users", cred.user.uid), profile);
    return { user: profile };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Bilinmeyen hata";
    if (msg.includes("email-already-in-use")) return { user: null as unknown as UserProfile, error: "Bu e-posta zaten kayıtlı." };
    if (msg.includes("weak-password")) return { user: null as unknown as UserProfile, error: "Şifre çok zayıf." };
    if (msg.includes("invalid-email")) return { user: null as unknown as UserProfile, error: "Geçersiz e-posta adresi." };
    return { user: null as unknown as UserProfile, error: msg };
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ user: UserProfile | null; error?: string }> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const snap = await getDoc(doc(db, "users", cred.user.uid));
    if (snap.exists()) {
      return { user: snap.data() as UserProfile };
    }
    return {
      user: {
        uid: cred.user.uid,
        name: cred.user.displayName || "",
        email: cred.user.email || "",
        phone: "",
        role: "user",
        createdAt: "",
        phoneVerified: false,
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Bilinmeyen hata";
    if (msg.includes("user-not-found")) return { user: null, error: "Kullanıcı bulunamadı." };
    if (msg.includes("wrong-password") || msg.includes("invalid-credential")) return { user: null, error: "E-posta veya şifre hatalı." };
    if (msg.includes("too-many-requests")) return { user: null, error: "Çok fazla deneme. Biraz bekleyin." };
    return { user: null, error: msg };
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export async function resetPassword(email: string): Promise<{ ok: boolean; error?: string }> {
  try {
    await sendPasswordResetEmail(auth, email);
    return { ok: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Bilinmeyen hata";
    return { ok: false, error: msg };
  }
}

export async function markPhoneVerified(uid: string): Promise<void> {
  await updateDoc(doc(db, "users", uid), { phoneVerified: true });
}
