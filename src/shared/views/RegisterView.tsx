import PasswordInput from "@/shared/components/PasswordInput";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { ModalViewPropsTypes } from "../ModalTypes";
import { AuthService} from "@/api/services/AuthService";

const RegisterView = ({ onSwitch }: ModalViewPropsTypes) => {
  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;

    setError(null);
    setOkMsg(null);

    if (!email.trim()) return setError("Podaj email.");
    if (!password) return setError("Podaj hasło.");
    if (password.length < 6) return setError("Hasło musi mieć co najmniej 6 znaków.");
    if (password !== confirm) return setError("Hasła nie są takie same.");
    if (!checked) return setError("Musisz zaakceptować regulamin i politykę prywatności.");

    setBusy(true);
    try {
      const res = await AuthService.register({ email, password });

      setOkMsg(res?.message ?? "Konto zostało utworzone.");
      setTimeout(() => onSwitch("login"), 800);
    } catch (err: any) {
      const msg =
        err?.message ??
        err?.details?.error_description ??
        err?.details?.error ??
        "Rejestracja nie powiodła się.";
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <form className="gap-y-4 flex flex-col mt-4" onSubmit={onSubmit}>
        <div className="gap-y-1 flex flex-col">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            autoComplete="email"
            disabled={busy}
          />
        </div>

        <div className="gap-y-1 flex flex-col">
          <Label htmlFor="username">Nazwa Użytkownika</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
            placeholder="(opcjonalnie)"
            disabled={busy}
          />
        </div>

        <div className="gap-y-1 flex flex-col">
          <Label htmlFor="password">Hasło</Label>
          <PasswordInput
            id="password"
            name="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.currentTarget.value)}
            autoComplete="new-password"
            disabled={busy}
          />
        </div>

        <div className="gap-y-1 flex flex-col">
          <Label htmlFor="confirmPassword">Potwierdź Hasło</Label>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            value={confirm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirm(e.currentTarget.value)}
            autoComplete="new-password"
            disabled={busy}
          />
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={checked}
            onCheckedChange={(val) => setChecked(!!val)}
            disabled={busy}
          />
          <Label htmlFor="terms" className="text-sm">
            Akceptuję{" "}
            <a href="#" className="underline">Regulamin</a> oraz{" "}
            <a href="#" className="underline">Politykę Prywatności</a>.
          </Label>
        </div>

        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        {okMsg && <p className="text-sm text-green-700" role="status">{okMsg}</p>}

        <Button type="submit" className="w-full cursor-pointer" disabled={busy}>
          {busy ? "Rejestrowanie…" : "Zarejestruj się"}
        </Button>
      </form>

      <p className="text-center text-sm mt-4">
        Masz już konto?{" "}
        <button
          onClick={() => onSwitch("login")}
          className="text-blue-500 cursor-pointer"
          disabled={busy}
        >
          Zaloguj się
        </button>
      </p>
    </>
  );
};

export default RegisterView;
