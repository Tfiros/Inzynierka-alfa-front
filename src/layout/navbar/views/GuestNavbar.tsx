import { Link } from "react-router-dom"
import { Button } from "@/componentsShared/button"
import CrossTradeLogo from "@/photos/CrossTradeLogo.png"
import { useState } from "react"
import AuthModal from "@/shared/AuthModal"
import type { AuthModalView } from "@/shared/ModalTypes"
import { NavItem } from "../components/NavItem"

export default function GuestNavbar() {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<AuthModalView>("login")
  return (
    <>
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
              <NavItem to="marketplace" label="Oferty" />
              <NavItem to="/faqs" label="FAQs" />
              <NavItem to="/statute" label="Regulamin" />
              <NavItem to="/contact" label="Kontakt" />
            </div>
            <div className="flex gap-1">
              <div className="flex gap-4 w-full max-w-sm">
                <Button
                  className="flex-1"
                  onClick={() => {
                    setView("login")
                    setOpen(true)
                  }}
                >
                  Zaloguj
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    setView("register")
                    setOpen(true)
                  }}
                  variant="secondary"
                >
                  Zarejestruj
                </Button>
              </div>
            </div>
          </nav>
        </div>
      </header>
      <AuthModal
        open={open}
        onOpenChange={setOpen}
        view={view}
        onViewChange={setView}
      />
    </>
  )
}
