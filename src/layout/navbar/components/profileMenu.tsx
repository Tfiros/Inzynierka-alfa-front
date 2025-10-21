import { useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { UserIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
export const ProfileMenu = () => {
    const [open, setOpen] = useState(false);
    return (
     <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger
                asChild
                onClick={() => setOpen(true)}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full cursor-pointer"
                  aria-label="Profil"
                  title="Profil"
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
    )
}
