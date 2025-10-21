import { Link } from 'react-router-dom'
//import { User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CrossTradeLogo from '@/photos/CrossTradeLogo.png'

export default function TopNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 w-full items-center justify-between px-6">
        <div className="w-20" />

        <div className="flex gap-2 -ml-250">
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
          <div className="flex gap-1">
            <div className="flex gap-4 w-full max-w-sm">
              <Button className="flex-1">Zaloguj</Button>
              <Button className="flex-1" variant="secondary">
                Zarejestruj
              </Button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}

