import { Button } from "@/components/ui/button"
import { Settings, UserPlus } from "lucide-react"

type Props = {
  onAddUser: () => void
  loading: boolean
}

export const HeaderSection = ({ onAddUser, loading }: Props) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Panel Administratora
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Zarządzaj użytkownikami i uprawnieniami
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" aria-label="Ustawienia">
          <Settings className="h-4 w-4" />
        </Button>

        <Button onClick={onAddUser} disabled={loading}>
          <UserPlus className="h-4 w-4" />
          Dodaj użytkownika
        </Button>
      </div>
    </div>
  )
}
