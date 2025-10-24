import type { StateCreator } from "zustand";
import { AuthService}  from "@/api/services/AuthService";

export type JwtPayload = { login?: string; exp?: number; [k: string]: unknown };
const ACCESS_KEY = "accessToken";

function parseJwt(token: string | null): JwtPayload | null {
  if (!token) return null;
  try {
    const b64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(b64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export type AuthSlice = {
  accessToken: string | null;
  userLogin: string | null;
  isAuthenticated: boolean;
  setAccessToken: (token: string | undefined) => void;
  login: (email: string, password: string) => Promise<void>;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

type StoreState = AuthSlice & Record<string, unknown>;

export const createAuthSlice: StateCreator<StoreState, [], [], AuthSlice> = (set, get, _api) => {
  void _api;

  return {
    accessToken: sessionStorage.getItem(ACCESS_KEY),
    userLogin: parseJwt(sessionStorage.getItem(ACCESS_KEY))?.login ?? null,
    isAuthenticated: !!sessionStorage.getItem(ACCESS_KEY),

    setAccessToken: (token) => {
      if (token) {
        sessionStorage.setItem(ACCESS_KEY, token);
        const payload = parseJwt(token);
        set({
          accessToken: token,
          userLogin: payload?.login ?? null,
          isAuthenticated: true,
        });
      } else {
        sessionStorage.removeItem(ACCESS_KEY);
        set({ accessToken: null, userLogin: null, isAuthenticated: false });
      }
    },

    login: async (email, password) => {
      const res = await AuthService.login( {email, password});
      get().setAccessToken(res.data?.accessToken);
    },

    refresh: async () => {
      const res = await AuthService.refresh();
      get().setAccessToken(res.data?.accessToken);
    },

    logout: async () => {
      await AuthService.logout().catch(() => {});
      get().setAccessToken(undefined);
    },
  };
};
