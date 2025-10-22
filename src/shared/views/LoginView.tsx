import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ModalViewPropsTypes } from "../ModalTypes";
import AuthService from "@/api/services/AuthService";
import { useAppStore } from "@/store/appStore";

const LoginView = ({ onSwitch }: ModalViewPropsTypes) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setAuthenticated = useAppStore((s) => s.setAuthenticated);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);

    try {
      const res = await AuthService.login({ email, password });
      console.log(res);
      if (res.status > 300) {
        setError(res?.message ?? "Logowanie nie powiodło się.");
        return;
      }
      const accessToken  = (res as any)?.accessToken ?? (res as any)?.idToken ?? null;
    const refreshToken = (res as any)?.refreshToken ?? null;
    const userId       = (res as any)?.userId ?? (res as any)?.sub ?? null;
      if (!accessToken) {
        setError("Brak tokena w odpowiedzi serwera.");
        return;
      }

      sessionStorage.setItem("accessToken", accessToken);
      if (refreshToken) {
        document.cookie = `refreshToken=${encodeURIComponent(
          refreshToken
        )}; Path=/; SameSite=Lax`;
        // produkcja + HTTPS: dopisac ; Secure
      }

      setAuthenticated(true, userId);
    } catch (err: any) {
      const msg =
        err?.Details?.ErrorDescription ||
        err?.Details?.Text ||
        err?.Message ||
        "Wystąpił błąd podczas logowania.";
      setError(msg);
      console.error("Login exception", err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="gap-y-4 flex flex-col mt-4">
        <div className="gap-y-1 flex flex-col">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            autoComplete="username"
            disabled={busy}
          />
        </div>

        <div className="gap-y-1 flex flex-col">
          <Label htmlFor="password">Hasło</Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            autoComplete="current-password"
            disabled={busy}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <div className="flex items-end">
          <button
            type="button"
            onClick={() => onSwitch("forgot-email")}
            className="text-sm font-semibold cursor-pointer"
            disabled={busy}
          >
            Zapomniałeś hasła?
          </button>
        </div>

        <Button type="submit" className="w-full cursor-pointer" disabled={busy}>
          {busy ? "Logowanie…" : "Zaloguj się"}
        </Button>
      </form>

      <p className="text-center text-sm mt-4">
        Nie masz konta?{" "}
        <button
          onClick={() => onSwitch("register")}
          className="text-blue-500 cursor-pointer"
          disabled={busy}
        >
          Zarejestruj się
        </button>
      </p>
    </>
  );
};

export default LoginView;
