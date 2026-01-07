import { useState, useMemo, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/dropdown-menu"
import { Button } from "@/shared/components/button"
import { User as UserIcon, LogOut, Trophy, Settings, Moon } from "lucide-react"
import { useAppStore } from "@/shared/store/AppStore"
import DarkModeSwitch from "@/shared/components/DarkModeSwitch"

export const ProfileMenu = () => {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  const navbarUser = useAppStore((s) => s.navbarUser)
  const userId = useAppStore((s) => s.userId)
  const logout = useAppStore((s) => s.logout)

  const navigate = useNavigate()
  const displayName = navbarUser?.nickname ?? "Użytkownik"
  const email = navbarUser?.email ?? "—"

  const initials = useMemo(() => {
    const parts = displayName.trim().split(/\s+/)
    const letters = parts.map((p) => p[0]?.toUpperCase()).join("")
    return letters.slice(0, 2) || "U"
  }, [displayName])

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
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full cursor-pointer"
          aria-label="Profil"
          title="Profil"
          disabled={busy}
        >
          <UserIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal px-3 py-2">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-black text-xs font-semibold text-white">
              {initials}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-none">
                {displayName}
              </span>
              <span className="text-xs text-muted-foreground">{email}</span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {userId != null && (
          <DropdownMenuItem asChild>
            <Link to={`/profile/${userId}`} className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              <span>Mój profil</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <Link to="/dashboard" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            <span>Panel Klienta</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Ustawienia</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault()
          }}
          className="p-0"
        >
          <div className="flex items-center justify-between w-full px-2 py-1.5">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4" />
              <span>Ciemny motyw</span>
            </div>

            <DarkModeSwitch />
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault()
            void handleLogout()
          }}
          disabled={busy}
          className="text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{busy ? "Wylogowywanie…" : "Wyloguj się"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
