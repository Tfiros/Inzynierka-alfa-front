import { Link } from "react-router-dom"
import { Button } from "@/shared/components/button"
import CrossTradeLogo from "@/photos/CrossTradeLogo.png"
import PointsIcon from "@/photos/PointsIcon.svg"
import NoifyIcon from "@/photos/NotificationIcon.svg"
import { NavItem } from "../components/NavItem"
import { ProfileMenu } from "../components/ProfileMenu"
import { useAppStore } from "@/store/appStore"

export const UserNavbar = () => {
  const navbarUser = useAppStore((s) => s.navbarUser)
  const roles = useAppStore((s) => s.roles)

  const isAdmin = roles.some((r) => r.toLowerCase() === "admin")
  const tokens = navbarUser?.tokens ?? 0
  const level = navbarUser?.level ?? 1
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 w-full items-center justify-between px-6">
        <div className="flex gap-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <img
              src={CrossTradeLogo}
              alt="CROSSTRADE"
              className="h-15 w-15 object-contain"
            />
            <span className="sr-only">CROSSTRADE</span>
          </Link>
        </div>

        <nav className="flex items-center gap-4 text-sm">
          <div className="flex gap-6">
            {isAdmin && (
              <NavItem to="/itemManagement" label="Zarządzanie przedmiotami" />
            )}
            {isAdmin && <NavItem to="/userManagement" label="Użytkownicy" />}
            <NavItem to="marketplace" label="Oferty" />
            <NavItem to="/faqs" label="FAQs" />
            <NavItem to="/statute" label="Regulamin" />
            <NavItem to="/contact" label="Kontakt" />
          </div>

          <div className="flex gap-1 items-center">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="rounded-full"
              title="Punkty"
            >
              <Link to="/shop">
                <img
                  src={PointsIcon}
                  alt="shop"
                  className="h-6 w-6 object-contain"
                />
                <span className="ml-1 text-sm font-medium">
                  {tokens.toLocaleString("pl-PL")}
                </span>
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="sm"
              className="rounded-full px-3"
              title="Poziom"
            >
              <Link to="/points">
                <span className="text-sm font-semibold">{level}</span>
                <span className="ml-1 text-xs text-muted-foreground">
                  Poziom
                </span>
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="sm"
              className="rounded-full"
              title="Powiadomienia"
            >
              <Link to="/notifications">
                <img
                  src={NoifyIcon}
                  alt="NotificationIcon"
                  className="h-6 w-6 object-contain"
                />
              </Link>
            </Button>

            <ProfileMenu />
          </div>
        </nav>
      </div>
    </header>
  )
}
