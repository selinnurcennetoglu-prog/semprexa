export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;
  phone_verified: boolean;
}

const API = "/api/auth";
const STORAGE_KEY = "semprexa_session";

interface StoredSession {
  access_token: string;
  refresh_token: string;
}

function getStoredSession(): StoredSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function storeSession(session: StoredSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

let _accessToken: string | null = null;
let _refreshToken: string | null = null;

function restoreSession() {
  if (_accessToken) return;
  const s = getStoredSession();
  if (s) {
    _accessToken = s.access_token;
    _refreshToken = s.refresh_token;
  }
}

export function setAccessToken(token: string | null) {
  _accessToken = token;
}
export function getAccessToken() {
  return _accessToken;
}

async function apiCall(body: Record<string, unknown>) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function registerUser(
  name: string, email: string, password: string, phone: string
): Promise<{ user: UserProfile | null; error?: string }> {
  try {
    const json = await apiCall({ action: "signup", name, email, password, phone });
    if (json.error) return { user: null, error: json.error };
    if (json.access_token && json.refresh_token) {
      storeSession({ access_token: json.access_token, refresh_token: json.refresh_token });
      _accessToken = json.access_token;
      _refreshToken = json.refresh_token;
    }
    notify(json.user);
    return { user: json.user };
  } catch (err: unknown) {
    return { user: null, error: err instanceof Error ? err.message : "Baglanti hatasi" };
  }
}

export async function loginUser(
  email: string, password: string
): Promise<{ user: UserProfile | null; error?: string }> {
  try {
    const json = await apiCall({ action: "login", email, password });
    if (json.error) return { user: null, error: json.error };
    if (json.access_token && json.refresh_token) {
      storeSession({ access_token: json.access_token, refresh_token: json.refresh_token });
      _accessToken = json.access_token;
      _refreshToken = json.refresh_token;
    }
    notify(json.user);
    return { user: json.user };
  } catch (err: unknown) {
    return { user: null, error: err instanceof Error ? err.message : "Baglanti hatasi" };
  }
}

export async function logoutUser(): Promise<void> {
  _accessToken = null;
  _refreshToken = null;
  clearSession();
  notify(null);
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  restoreSession();
  if (!_accessToken) return null;
  try {
    const json = await apiCall({ action: "me", token: _accessToken });
    if (json.access_token && json.access_token !== _accessToken) {
      _accessToken = json.access_token;
      if (_refreshToken) {
        storeSession({ access_token: json.access_token, refresh_token: _refreshToken });
      }
    }
    return json.user || null;
  } catch {
    return null;
  }
}

async function tryRefresh(): Promise<boolean> {
  if (!_refreshToken) return false;
  try {
    const json = await apiCall({ action: "refresh", refresh_token: _refreshToken });
    if (json.access_token) {
      const newAccess = json.access_token as string;
      const newRefresh = json.refresh_token as string || _refreshToken!;
      _accessToken = newAccess;
      _refreshToken = newRefresh;
      storeSession({ access_token: newAccess, refresh_token: newRefresh });
      return true;
    }
  } catch {}
  return false;
}

let _listeners: Array<(user: UserProfile | null) => void> = [];
let _initialized = false;
let _currentUser: UserProfile | null = null;

function notify(user: UserProfile | null) {
  _currentUser = user;
  _listeners.forEach((l) => {
    try { l(user); } catch {}
  });
}

async function checkSession() {
  restoreSession();
  const user = await getCurrentUser();
  if (user) {
    notify(user);
  } else if (_accessToken) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      const user2 = await getCurrentUser();
      notify(user2);
    } else {
      clearSession();
      _accessToken = null;
      _refreshToken = null;
      notify(null);
    }
  } else {
    notify(null);
  }
}

export async function onAuthChange(callback: (user: UserProfile | null) => void): Promise<() => void> {
  _listeners.push(callback);

  if (_currentUser !== null || _listeners.length === 1) {
    callback(_currentUser);
  }

  if (!_initialized) {
    _initialized = true;
    checkSession();
  }

  return () => {
    _listeners = _listeners.filter((l) => l !== callback);
  };
}
