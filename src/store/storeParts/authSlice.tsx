import type { StateCreator } from "zustand";
import { AuthService } from "@/api/services/AuthService";
import { UserInfoService } from "@/api/services/UserInfoService";
import type { UserNavbarInfoDto } from "@/shared/types/userTypes/UserInfoTypes";

export type JwtPayload = {
  login?: string;
  exp?: number;
  [k: string]: unknown;
};

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
  userId: number | null;
  navbarUser: UserNavbarInfoDto | null;
  isAuthenticated: boolean;

  setAccessToken: (token: string | undefined) => void;
  setNavbarUser: (info: UserNavbarInfoDto | null) => void;

  login: (email: string, password: string) => Promise<void>;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

type StoreState = AuthSlice & Record<string, unknown>;


export const createAuthSlice: StateCreator<StoreState, [], [], AuthSlice> = (set, get, _api) => {
  void _api;

  const initialToken = sessionStorage.getItem(ACCESS_KEY);
  const initialPayload = parseJwt(initialToken);

  return {
    accessToken: initialToken,
    userLogin: initialPayload?.login ?? null,
    userId: null,
    navbarUser: null,
    isAuthenticated: !!initialToken,

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
        set({
          accessToken: null,
          userLogin: null,
          userId: null,
          navbarUser: null,
          isAuthenticated: false,
        });
      }
    },

    setNavbarUser: (info) => {
      set({ navbarUser: info });
    },

    login: async (email, password) => {
      const res = await AuthService.login({ email, password });
      const id = res.id;
      const accessToken = res.accessToken;
      if (!accessToken) {
        throw new Error("Brak access tokena w odpowiedzi serwera.");
      }

      get().setAccessToken(accessToken);
      set({ userId: id });

      const navRes = await UserInfoService.getNavbarInfo(id);
      set({ navbarUser: navRes });     
    },

    refresh: async () => {
      const res = await AuthService.refresh();
        get().setAccessToken(res.accessToken);
        get().setAccessToken(undefined);
    },

    logout: async () => {
      await AuthService.logout().catch(() => {});
      get().setAccessToken(undefined);
    },
  };
};