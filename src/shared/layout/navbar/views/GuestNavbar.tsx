import { Link } from "react-router-dom"
import { Button } from "@/shared/components/button"
import CrossTradeLogo_light from "@/shared/photos/CrossTradeLogo-light.webp"
import CrossTradeLogo_dark from "@/shared/photos/CrossTradeLogo-Dark.webp"
import { NavItem } from "../components/NavItem"
import { useAppStore } from "@/shared/store/appStore"
import { publicLinks } from "../navLinks"
import MobileNav from "../components/MobileNav"

export default function GuestNavbar() {
  const authRequestLogin = useAppStore((s) => s.authRequestLogin)
  const authRequestRegister = useAppStore((s) => s.authRequestRegister)
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

        <nav className="flex items-center gap-4 text-sm">
          <div className="hidden lg:flex gap-6">
            {publicLinks.map((l) => (
              <NavItem key={l.to} to={l.to} label={l.label} />
            ))}
          </div>
          <div className="hidden lg:flex gap-1">
            <div className="flex gap-4 w-full max-w-sm">
              <Button
                className="flex-1 cursor-pointer"
                onClick={authRequestLogin}
              >
                Zaloguj
              </Button>
              <Button
                className="flex-1 cursor-pointer"
                onClick={authRequestRegister}
                variant="secondary"
              >
                Zarejestruj
              </Button>
            </div>
          </div>
          <MobileNav links={publicLinks} />
        </nav>
      </div>
    </header>
  )
}
