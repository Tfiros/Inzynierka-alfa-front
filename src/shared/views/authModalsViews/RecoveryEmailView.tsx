import { Button } from "@/shared/components/button"
import { Input } from "@/shared/components/input"
import type { ModalViewPropsTypes } from "../../utilities/Auth/ModalTypes"
import { Label } from "../../components/label"
import { useRecoveryEmail } from "./hooks/UseRecoveryEmail"

const RecoveryEmailView = ({ onSwitch }: ModalViewPropsTypes) => {
  const { email, setEmail, busy, error, okMsg, submit } =
    useRecoveryEmail(onSwitch)

  return (
    <>
      <form className="gap-y-4 flex flex-col mt-4" onSubmit={submit}>
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

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {okMsg && (
          <p className="text-sm text-green-700" role="status">
            {okMsg}
          </p>
        )}

        <Button type="submit" className="w-full cursor-pointer" disabled={busy}>
          {busy ? "Wysyłanie…" : "Odzyskaj hasło"}
        </Button>
      </form>
    </>
  )
}

export default RecoveryEmailView
