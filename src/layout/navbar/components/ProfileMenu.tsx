import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserIcon } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import AuthService from "@/api/services/AuthService";
export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined" || !document.cookie) return null;
  const parts = document.cookie.split(";");
  for (const part of parts) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return null;
};

export const ProfileMenu = () => {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const setAuthenticated = useAppStore((s) => s.setAuthenticated);
  const navigate = useNavigate();

  const clearAuthClientSide = () => {
    sessionStorage.removeItem("accessToken");
    document.cookie = "refreshToken=; Path=/; Max-Age=0; SameSite=Lax";
  };

  const handleLogout = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const rt = getCookie('rt');
      console.log(rt);
      await AuthService.logout({ refreshToken: rt ?? "" });
    } finally {
      clearAuthClientSide();
      setAuthenticated(false, null);
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
        className="w-48"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col">
            <span className="text-sm font-medium leading-none">Twoje konto</span>
            <span className="text-xs text-muted-foreground">user@mail.com</span>
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
