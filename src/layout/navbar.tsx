import { Link, NavLink } from 'react-router-dom'
import { User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function TopNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 w-full items-center justify-between px-6">
        <div className="w-20" />

        <Link to="/" className="inline-flex items-center gap-2">
          <img
            src="/logo.svg"
            alt="CROSSTRADE"
            className="h-8 w-8 object-contain"
          />
          <span className="sr-only">CROSSTRADE</span>
        </Link>

        <nav className="flex items-center gap-8 text-sm">
          <NavItem to="/perks" label="Perks" />
          <NavItem to="/works" label="Works" />
          <NavItem to="/pricing" label="Pricing" />
          <NavItem to="/faqs" label="FAQs" />
          <Button asChild variant="ghost" size="icon" className="rounded-full">
            <Link to="/profile" aria-label="Profil">
              <UserIcon className="h-5 w-5" />
            </Link>
          </Button>
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
