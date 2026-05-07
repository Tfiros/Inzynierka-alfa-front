import { Link } from "react-router-dom"
import { Button } from "@/shared/components/button"
import CrossTradeLogo_light from "@/shared/photos/CrossTradeLogo-light.png"
import CrossTradeLogo_dark from "@/shared/photos/CrossTradeLogo-Dark.png"
import PointsIcon from "@/shared/photos/PointsIcon.svg"
import NoifyIcon from "@/shared/photos/NotificationIcon.svg"
import NoifyIcon_Dark from "@/shared/photos/NotificationIcon_Dark.svg"
import { NavItem } from "../components/NavItem"
import { ProfileMenu } from "../components/ProfileMenu"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip"
import NavbarChatDropdown from "@/features/Chat/components/NavbarChatDropdown"
import { useAppStore } from "@/shared/store/appStore"

export const UserNavbar = () => {
  const navbarUser = useAppStore((s) => s.navbarUser)
  const roles = useAppStore((s) => s.roles)
  const unread = useAppStore((s) => s.unreadNotificationsCount)
  const isAdmin = roles.some((r) => r.toLowerCase() === "admin")
  const isMiddleman = roles.some((r) => r.toLowerCase() === "middleman")
  const tokens = navbarUser?.tokens ?? 0
  const escrowedTokens = navbarUser?.escrowedTokens ?? 0
  const level = navbarUser?.level ?? 1
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 w-full items-center justify-between px-6">
        <div className="flex gap-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <img
              src={CrossTradeLogo_light}
              alt="CROSSTRADE"
              className="h-15 w-15 object-contain dark:hidden"
            />
            <img
              src={CrossTradeLogo_dark}
              alt="CROSSTRADE"
              className="h-15 w-15 object-contain dark:block"
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

            {isMiddleman && (
              <NavItem to="/tradePanel" label="Panel pośrednika" />
            )}
            {!isMiddleman && <NavItem to="/tradePanel" label="Panel wymian" />}

            <NavItem to="/marketplace" label="Oferty" />
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
                {escrowedTokens > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="ml-1 rounded-md border border-green-500/40 bg-green-500/10 px-2 py-0.5 text-sm font-medium text-green-400">
                        +{escrowedTokens.toString()}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      Oczekujące saldo - zostanie zwolnione po zakończeniu
                      wymiany.
                    </TooltipContent>
                  </Tooltip>
                )}
              </Link>
            </Button>

            <span className="text-sm font-semibold">{level}</span>
            <span className="ml-1 text-xs text-muted-foreground">Poziom</span>

            <Button
              asChild
              variant="ghost"
              size="sm"
              className="rounded-full relative"
              title="Powiadomienia"
            >
              <Link to="/notifications" className="relative">
                <img
                  src={NoifyIcon}
                  alt="NotificationIcon"
                  className="h-6 w-6 object-contain block dark:hidden"
                />
                <img
                  src={NoifyIcon_Dark}
                  alt="NotificationIcon"
                  className="h-6 w-6 object-contain hidden dark:block"
                />

                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-destructive-foreground text-[11px] leading-[18px] text-center">
                    {unread > 99 ? "99+" : unread}
                  </span>
                )}
              </Link>
            </Button>
            <NavbarChatDropdown />

            <ProfileMenu />
          </div>
        </nav>
      </div>
    </header>
  )
}
