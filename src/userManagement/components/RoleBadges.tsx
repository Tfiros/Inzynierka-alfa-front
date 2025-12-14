import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const roleClasses = (role: string) => {
  const r = role.toLowerCase()

  if (r === "admin") return "bg-blue-600 text-white border-blue-600"
  if (r === "middleman") return "bg-amber-600 text-white border-amber-600"

  return "bg-zinc-700 text-white border-zinc-700"
}

type Props = { roles: string[] }

export const RoleBadges = ({ roles }: Props) => {
  if (!roles?.length) {
    return (
      <Badge className="rounded-md bg-muted text-foreground border border-border font-medium">
        brak
      </Badge>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {roles.map((r) => (
        <Badge
          key={r}
          className={cn(
            "rounded-md px-2.5 py-0.5 text-xs font-semibold tracking-wide border",
            roleClasses(r)
          )}
        >
          {r}
        </Badge>
      ))}
    </div>
  )
}
