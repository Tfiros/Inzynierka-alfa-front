// utils: proste dekodowanie JWT żeby wyciągnąć login do Navbara
function parseJwt(token: string | null): { login?: string; exp?: number } | null {
  if (!token) return null;
  try {
    const b64 = token.split(".")[1];
    const json = atob(b64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(json.split("").map(c => `%${("00"+c.charCodeAt(0).toString(16)).slice(-2)}`).join("")));
  } catch {
    return null;
  }
}

const ACCESS_KEY = "accessToken";

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: sessionStorage.getItem(ACCESS_KEY),
  userLogin: parseJwt(sessionStorage.getItem(ACCESS_KEY))?.login ?? null,
  isAuthenticated: !!sessionStorage.getItem(ACCESS_KEY),

  setAccessToken: (token) => {
    if (token) {
      sessionStorage.setItem(ACCESS_KEY, token);
      const p = parseJwt(token);
      set({ accessToken: token, userLogin: p?.login ?? null, isAuthenticated: true });
    } else {
      sessionStorage.removeItem(ACCESS_KEY);
      set({ accessToken: null, userLogin: null, isAuthenticated: false });
    }
  },

  // LOGIN: backend ustawia RT w cookie; front dostaje accessToken w JSON
  login: async (email, password) => {
    const res = await fetch("/Login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    const data = await res.json(); // { accessToken, expiresIn, idToken }
    get().setAccessToken(data.accessToken);
  },

  // REFRESH: BE czyści/rotuje cookie RT, front dostaje nowy accessToken
  refresh: async () => {
    const res = await fetch("/Login/refresh", {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) {
      get().setAccessToken(null);
      throw new Error("Refresh failed");
    }
    const data = await res.json(); // { accessToken, ... }
    get().setAccessToken(data.accessToken);
  },

  logout: async () => {
    await fetch("/Login/logout", { method: "POST", credentials: "include" }).catch(() => {});
    get().setAccessToken(null);
  },
}));
