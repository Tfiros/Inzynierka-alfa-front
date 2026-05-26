import { useState } from "react"
import { useAppStore } from "../store/appStore"
import { useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"
import type { Button } from "./button"

type LogoutButtonProps = React.ComponentProps<typeof Button>

function LogoutButton({}: LogoutButtonProps) {
  const [busy, setBusy] = useState(false)
  const [, setOpen] = useState(false)

  const logout = useAppStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = async () => {
    if (busy) return
    setBusy(true)
    try {
      await logout()
      setOpen(false)
      navigate("/")
    } catch (e) {
      console.warn("Logout error (ignored):", e)
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        void handleLogout()
      }}
      disabled={busy}
      className="flex items-center text-red-600 disabled:opacity-50"
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span>{busy ? "Wylogowywanie…" : "Wyloguj się"}</span>
    </button>
  )
}

export default LogoutButton
