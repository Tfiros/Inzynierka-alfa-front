import type { NavbarLink } from "../navLinks"
import { Menu } from "lucide-react"
import { Button } from "@/shared/components/button"
import { NavLink } from "react-router-dom"
import { useAppStore } from "@/shared/store/appStore"
import { useState } from "react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/sheet"

type Props = {
  links: NavbarLink[]
}

const MobileNav = ({ links }: Props) => {
  const isLogged = useAppStore((s) => s.isAuthenticated)
  const authRequestLogin = useAppStore((s) => s.authRequestLogin)
  const authRequestRegister = useAppStore((s) => s.authRequestRegister)
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-2">
          <NavLink
            to={"/"}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent ${isActive ? "font-medium shadow-[inset_2px_0_0_0] bg-primary/5" : "text-foreground/70"}`
            }
          >
            Strona główna
          </NavLink>

          {links.map((l) => (
            <NavLink
              to={l.to}
              key={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent ${isActive ? "font-medium shadow-[inset_2px_0_0_0] bg-primary/5" : "text-foreground/70"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        {!isLogged && (
          <div className="mt-4 flex flex-col gap-2 border-t pt-2 mx-4">
            <SheetClose asChild>
              <Button onClick={authRequestLogin}>Zaloguj</Button>
            </SheetClose>
            <SheetClose asChild>
              <Button onClick={authRequestRegister} variant="secondary">
                Zarejestruj
              </Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default MobileNav
