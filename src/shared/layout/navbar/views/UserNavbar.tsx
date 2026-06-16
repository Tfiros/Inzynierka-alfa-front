import { Link } from "react-router-dom"
import CrossTradeLogo_light from "@/shared/photos/CrossTradeLogo-light.webp"
import CrossTradeLogo_dark from "@/shared/photos/CrossTradeLogo-Dark.webp"
import { NavItem } from "../components/NavItem"
import { ProfileMenu } from "../components/ProfileMenu"
import { lazy, Suspense } from "react"
import { userLinks } from "../navLinks"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip"
import { useAppStore } from "@/shared/store/appStore"
import NavbarFallback from "../components/NavbarFallback"
import ErrorBoundary from "@/shared/components/ErrorBoundary"
import MobileNav from "../components/MobileNav"
import ProfileTokens from "../components/ProfileTokens"
        
const NavbarChatDropdown = lazy(
  () => import("@/features/chat/components/NavbarChatDropdown")
)

const NotificationsDropdown = lazy(
  () =>
    import("@/features/notifications/NotificationsDropdown/components/NotificationsDropdown")
)

export const UserNavbar = () => {
  const navbarUser = useAppStore((s) => s.navbarUser)
  const roles = useAppStore((s) => s.roles)
  const isAdmin = roles.some((r) => r.toLowerCase() === "admin")
  const isMiddleman = roles.some((r) => r.toLowerCase() === "middleman")
  const tokens = navbarUser?.tokens ?? 0
  const escrowedTokens = navbarUser?.escrowedTokens ?? 0
  const level = navbarUser?.level ?? 1
  const links = userLinks(isAdmin, isMiddleman)
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 w-full items-center justify-between px-4 lg:px-6">
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
              className="h-15 w-15 object-contain hidden dark:block"
            />
            <span className="sr-only">CROSSTRADE</span>
          </Link>
        </div>

        <nav className="flex items-center gap-2 lg:gap-4 text-sm">
          <div className="hidden lg:flex gap-6">
            {links.map((l) => (
              <NavItem key={l.to} to={l.to} label={l.label} />
            ))}
          </div>
          <div className="flex gap-1 items-center">
            <ProfileTokens tokens={tokens} escrowedTokens={escrowedTokens} />

            <span className="hidden lg:inline text-sm font-semibold">
              {level}
            </span>
            <span className="ml-1 hidden lg:inline text-xs text-muted-foreground">
              Poziom
            </span>
            <MobileNav links={links} />

            <ErrorBoundary
              fallback={<NavbarFallback />}
              errorMessage="Nie udało się załadować powiadomień. Odśwież stronę"
            >
              <Suspense fallback={<NavbarFallback />}>
                <NotificationsDropdown />
              </Suspense>
            </ErrorBoundary>
            <ErrorBoundary
              fallback={<NavbarFallback />}
              errorMessage="Nie udało się załadować chatu. Odśwież stronę"
            >
              <Suspense fallback={<NavbarFallback />}>
                <NavbarChatDropdown />
              </Suspense>
            </ErrorBoundary>

            <ProfileMenu />
          </div>
        </nav>
      </div>
    </header>
  )
}
