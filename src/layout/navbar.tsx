import { Link, NavLink } from 'react-router-dom'
import { User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CrossTradeLogo from '@/photos/CrossTradeLogo.png'
import PointsIcon from '@/photos/PointsIcon.svg'
import NoifyIcon from '@/photos/NotificationIcon.svg'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'

export default function TopNav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 w-full items-center justify-between px-6">
        <div className="w-20" />

        <div className="flex gap-2 -ml-200">
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
            <NavItem to="/oferty" label="Oferty" />
            <NavItem to="/faqs" label="FAQs" />
          </div>

          <div className="flex gap-1">
            <Button asChild variant="ghost" size="sm" className="rounded-full">
              <Link to="/points">
                <img
                  src={PointsIcon}
                  alt="Points"
                  className="h-6 w-6 object-contain"
                />
                <span className="text-sm">125</span>
              </Link>
            </Button>

            <Button asChild variant="ghost" size="sm" className="rounded-full">
              <Link to="/points">
                <span className="text-sm">10</span>
                <span>lvl</span>
              </Link>
            </Button>

            <Button asChild variant="ghost" size="sm" className="rounded-full">
              <Link to="/notifications">
                <img
                  src={NoifyIcon}
                  alt="NotificationIcon"
                  className="h-6 w-6 object-contain"
                />
              </Link>
            </Button>

            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger
                asChild
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  aria-label="Profil"
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
                    <span className="text-sm font-medium leading-none">
                      Twoje konto
                    </span>
                    <span className="text-xs text-muted-foreground">
                      user@mail.com
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
                  <Link to="/dashboard">Panel </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => console.log('Wyloguj')}>
                  Wyloguj
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </div>
    </header>
  )
}

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `transition-colors hover:text-foreground ${
          isActive ? 'text-foreground' : 'text-foreground/70'
        }`
      }
    >
      {label}
    </NavLink>
  )
}
