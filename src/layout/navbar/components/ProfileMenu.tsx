import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserIcon } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { AuthService } from "@/api/services/AuthService";

export const ProfileMenu = () => {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const setAccessToken = useAppStore((s) => s.setAccessToken);
  const userLogin = useAppStore((s) => s.userLogin);
  const navigate = useNavigate();

  const clearAuthClientSide = () => {
    sessionStorage.removeItem("accessToken");
    setAccessToken(undefined);
  };

  const handleLogout = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await AuthService.logout();
    } catch (e) {
      console.warn("Logout error (ignored):", e);
    } finally {
      clearAuthClientSide();
      setOpen(false);
      setBusy(false);
      navigate("/");
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild onClick={() => setOpen(true)}>
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

      <DropdownMenuContent
        align="end"
        className="w-56"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col">
            <span className="text-sm font-medium leading-none">Twoje konto</span>
            <span className="text-xs text-muted-foreground">
              {userLogin ?? "—"}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link to="/profile">Profil</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings">Ustawienia</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/dashboard">Panel</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            void handleLogout();
          }}
          disabled={busy}
        >
          {busy ? "Wylogowywanie…" : "Wyloguj"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
