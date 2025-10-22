import { useEffect, useState } from "react";
import { useAppStore } from "@/store/appStore";
import AuthService from "@/api/services/AuthService";

const readCookie = (name: string): string | null => {
  if (!document.cookie) return null;
  const parts = document.cookie.split(";");
  for (const part of parts) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return null;
};

const base64UrlDecode = (input: string): string => {
  const pad = (s: string) => s + "===".slice((s.length + 3) % 4);
  const b64 = pad(input.replace(/-/g, "+").replace(/_/g, "/"));
  return atob(b64);
};

const parseJwt = (token: string): any => {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    return JSON.parse(base64UrlDecode(payload));
  } catch {
    return null;
  }
};

const isExpired = (token: string, skewMs = 5000): boolean => {
  try {
    const { exp } = parseJwt(token) ?? {};
    return !exp || exp * 1000 < Date.now() + skewMs;
  } catch {
    return true;
  }
};

export const useAuthBootstrap = (): boolean => {
  const setAuthenticated = useAppStore((s) => s.setAuthenticated);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        // 1) Spróbuj accessToken z sessionStorage
        const token = sessionStorage.getItem("accessToken");
        if (token && !isExpired(token)) {
          const payload = parseJwt(token);
          const userId = payload?.sub ?? payload?.user_id ?? null;
          setAuthenticated(true, userId);
          return;
        }

        const rt = readCookie("refreshToken");
        if (!rt) {
          setAuthenticated(false, null);
          return;
        }
        const res = await AuthService.refresh({ refreshToken: rt });
        const data = (res && typeof res === "object" && "AccessToken" in res) ? res : (res as any)?.data ?? res;

        const newAccess: string | null = data?.AccessToken ?? data?.IdToken ?? null;
        const userIdResp: string | null = data?.UserId ?? null;

        if (newAccess) {
          sessionStorage.setItem("accessToken", newAccess);
          const payload = parseJwt(newAccess);
          const userId = userIdResp ?? payload?.sub ?? payload?.user_id ?? null;
          setAuthenticated(true, userId);
        } else {
          setAuthenticated(false, null);
        }
      } catch {
        setAuthenticated(false, null);
      } finally {
        setReady(true);
      }
    })();
  }, [setAuthenticated]);

  return ready;
};
