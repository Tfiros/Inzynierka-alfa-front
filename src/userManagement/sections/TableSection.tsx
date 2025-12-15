import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import type { UserListItemDto } from "@/shared/types/userTypes/UserManagementTypes"
import RoleBadges from "../components/RoleBadges"
import UserActionsMenu from "../components/UserActionsMenu"

const formatDate = (dateOnly: string | null | undefined) => {
  if (!dateOnly) return "—"
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateOnly)
  if (!m) return "—"
  const y = Number(m[1])
  const mo = Number(m[2]) - 1
  const d = Number(m[3])
  const dt = new Date(Date.UTC(y, mo, d))
  return new Intl.DateTimeFormat("pl-PL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(dt)
}

type Props = {
  loading: boolean
  error: string | null
  items: UserListItemDto[]
  onEdit: (u: UserListItemDto) => void
  onDelete: (u: UserListItemDto) => void
}

const TableSection = ({ loading, error, items, onEdit, onDelete }: Props) => {
  return (
    <Card className="mt-6 shadow-sm">
      <CardContent className="p-0">
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[22%]">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Użytkownik
                    </Button>
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TableHead>

                <TableHead className="w-[28%]">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Email
                    </Button>
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TableHead>

                <TableHead className="w-[22%] text-center font-semibold">
                  Role
                </TableHead>

                <TableHead className="w-[18%]">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Data rejestracji
                    </Button>
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TableHead>

                <TableHead className="w-[10%] text-right font-semibold">
                  Akcje
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-56" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-10 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}

              {!loading && error && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-sm text-destructive"
                  >
                    {error}
                  </TableCell>
                </TableRow>
              )}

              {!loading && !error && items.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    Brak użytkowników do wyświetlenia.
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                !error &&
                items.map((u) => (
                  <TableRow key={u.auth0UserId} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {u.name ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {u.email}
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <RoleBadges roles={u.roles ?? []} />
                      </div>
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {formatDate(u.registeredAt)}
                    </TableCell>

                    <TableCell className="text-right">
                      <UserActionsMenu
                        onEdit={() => onEdit(u)}
                        onDelete={() => onDelete(u)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
export default TableSection
