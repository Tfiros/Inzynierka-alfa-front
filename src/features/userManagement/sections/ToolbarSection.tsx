import { Input } from "@/shared/components/input"
import { Button } from "@/shared/components/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/dropdown-menu"
import { Search, ArrowUpDown } from "lucide-react"
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
}

const ToolbarSection = (props: Props) => {
  const {
    search,
    onSearchChange,
    loading,
    shownTo,
    totalCount,
    orderBy,
    onOrderByChange,
  } = props

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

export default ToolbarSection
