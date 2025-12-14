import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Filter, ArrowUpDown } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { UserListOrderBy } from "@/shared/types/userTypes/UserManagementTypes"

type Props = {
  search: string
  onSearchChange: (v: string) => void
  loading: boolean
  shownTo: number
  totalCount: number

  role: string | null
  onRoleChange: (role: string | null) => void

  orderBy: UserListOrderBy
  onOrderByChange: (orderBy: UserListOrderBy) => void
  onAddUser: () => void
}

const ROLE_OPTIONS = [
  "Admin",
  "Moderator",
  "Editor",
  "User",
  "Viewer",
  "Middleman",
]

const rolePillClass = (role: string) => {
  const r = role.toLowerCase()
  if (r === "admin") return "bg-blue-600 text-white"
  if (r === "moderator") return "bg-emerald-600 text-white"
  if (r === "editor") return "bg-violet-600 text-white"
  if (r === "middleman") return "bg-amber-600 text-white"
  if (r === "viewer") return "bg-slate-600 text-white"
  if (r === "user") return "bg-zinc-700 text-white"
  return "bg-zinc-700 text-white"
}

export const ToolbarSection = ({
  search,
  onSearchChange,
  loading,
  shownTo,
  totalCount,
  role,
  onRoleChange,
  orderBy,
  onOrderByChange,
}: Props) => {
  const [roleOpen, setRoleOpen] = useState(false)

  const handlePickRole = (r: string | null) => {
    onRoleChange(r)
    setRoleOpen(false)
  }

  return (
    <div className="mt-6 space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 self-start sm:self-auto"
              >
                <ArrowUpDown className="h-4 w-4" />
                Sortowanie
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuLabel>Sortuj według</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={String(orderBy)}
                onValueChange={(v) =>
                  onOrderByChange(Number(v) as UserListOrderBy)
                }
              >
                <DropdownMenuRadioItem
                  value={String(UserListOrderBy.NicknameAsc)}
                >
                  Nazwa (A-Z)
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value={String(UserListOrderBy.NicknameDesc)}
                >
                  Nazwa (Z-A)
                </DropdownMenuRadioItem>

                <DropdownMenuSeparator />

                <DropdownMenuRadioItem value={String(UserListOrderBy.EmailAsc)}>
                  Email (A-Z)
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value={String(UserListOrderBy.EmailDesc)}
                >
                  Email (Z-A)
                </DropdownMenuRadioItem>

                <DropdownMenuSeparator />

                <DropdownMenuRadioItem
                  value={String(UserListOrderBy.RegisteredAtAsc)}
                >
                  Data rejestracji (najstarsze)
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value={String(UserListOrderBy.RegisteredAtDesc)}
                >
                  Data rejestracji (najnowsze)
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Popover open={roleOpen} onOpenChange={setRoleOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 self-start sm:self-auto"
              >
                <Filter className="h-4 w-4" />
                {role ? `Rola: ${role}` : "Role"}
              </Button>
            </PopoverTrigger>

            <PopoverContent align="start" className="w-56 p-3">
              <div className="text-sm font-semibold">Filtruj po rolach</div>

              <div className="mt-3 grid gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  onClick={() => handlePickRole(null)}
                >
                  Wszystkie
                </Button>

                <div className="flex flex-wrap gap-2">
                  {ROLE_OPTIONS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handlePickRole(r)}
                      className={cn(
                        "rounded-md px-2.5 py-1 text-xs font-semibold shadow-sm",
                        rolePillClass(r),
                        role?.toLowerCase() === r.toLowerCase()
                          ? "ring-2 ring-ring ring-offset-2 ring-offset-background"
                          : ""
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Szukaj użytkownika..."
              className="pl-9"
            />
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          {loading
            ? "Ładowanie..."
            : `Pokazano ${shownTo} z ${totalCount} użytkowników`}
        </div>
      </div>
    </div>
  )
}
