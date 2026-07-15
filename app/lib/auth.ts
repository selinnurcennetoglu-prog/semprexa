export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  phoneVerified: boolean;
}

let _accessToken: string | null = null;

export function setAccessToken(token: string | null) { _accessToken = token; }
export function getAccessToken() { return _accessToken; }

const API = "/api/auth";

export async function registerUser(
  name: string, email: string, password: string, phone: string
): Promise<{ user: UserProfile | null; error?: string }> {
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "signup", name, email, password, phone }),
    });
    const json = await res.json();
    if (json.error) return { user: null, error: json.error };
    return { user: json.user };
  } catch (err: unknown) {
    return { user: null, error: err instanceof Error ? err.message : "Bağlantı hatası" };
  }
}

export async function loginUser(
  email: string, password: string
): Promise<{ user: UserProfile | null; error?: string }> {
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", email, password }),
    });
    const json = await res.json();
    if (json.error) return { user: null, error: json.error };
    return { user: json.user };
  } catch (err: unknown) {
    return { user: null, error: err instanceof Error ? err.message : "Bağlantı hatası" };
  }
}

export async function logoutUser(): Promise<void> {
  setAccessToken(null);
  if (typeof window !== "undefined") localStorage.removeItem("semprexa_session");
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const headers: Record<string, string> = {};
    if (_accessToken) headers["authorization"] = `Bearer ${_accessToken}`;
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({ action: "me" }),
    });
    const json = await res.json();
    return json.user || null;
  } catch {
    return null;
  }
}

let _listeners: Array<(user: UserProfile | null) => void> = [];
let _initialized = false;

function notify(user: UserProfile | null) {
  _listeners.forEach((l) => l(user));
}

async function checkSession() {
  const user = await getCurrentUser();
  notify(user);
}

export async function onAuthChange(callback: (user: UserProfile | null) => void): Promise<() => void> {
  _listeners.push(callback);
  if (!_initialized) {
    _initialized = true;
    checkSession();
  }
  return () => {
    _listeners = _listeners.filter((l) => l !== callback);
  };
}
