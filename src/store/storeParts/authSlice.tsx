import type { StateCreator } from "zustand";
import { AuthService } from "@/api/services/AuthService";
import { UserInfoService } from "@/api/services/UserInfoService";
import type { UserNavbarInfoDto } from "@/shared/types/userTypes/UserInfoTypes";

export type JwtPayload = {
  login?: string;
  exp?: number;
  [k: string]: unknown;
};

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

export const createAuthSlice: StateCreator<StoreState, [], [], AuthSlice> = (
  set,
  get,
  _api
) => {
  void _api;

  return {
    accessToken: null,
    userLogin: null,
    userId: null,
    navbarUser: null,
    isAuthenticated: false,

    setAccessToken: (token) => {
      if (token) {
        const payload = parseJwt(token);
        set({
          accessToken: token,
          userLogin: payload?.login ?? null,
          isAuthenticated: true,
        });
      } else {
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
      set({
        navbarUser: info,
        userId: info?.id ?? null,
      });
    },

    login: async (email, password) => {
      const res = await AuthService.login({ email, password });
      console.log(res);

      if (res.status !== 200 || !res.data) {
        throw new Error(res.message || "Nieznany błąd podczas logowania.");
      }

      const id = res.data.id;
      const accessToken = res.data.accessToken;

      get().setAccessToken(accessToken);
      set({ userId: id });

      const navRes = await UserInfoService.getNavbarInfo(id);
      if (navRes.isSuccess && navRes.data) {
        set({ navbarUser: navRes.data });
      }
    },

    refresh: async () => {
      const res = await AuthService.refresh();
      if (res.status !== 200 || !res.data?.accessToken) {
        throw new Error(res.message || "Nie udało się odświeżyć tokena.");
      }
      get().setAccessToken(res.data.accessToken);
    },

    logout: async () => {
      await AuthService.logout().catch(() => {});
      get().setAccessToken(undefined);
    },
  };
};
