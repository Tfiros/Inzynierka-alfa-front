import { Button } from "@/shared/components/button"
import { UserPlus } from "lucide-react"

type Props = {
  onAddUser: () => void
  loading: boolean
}

const HeaderSection = (props: Props) => {
  const { onAddUser, loading } = props

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
        <Button onClick={onAddUser} disabled={loading}>
          <UserPlus className="h-4 w-4" />
          Dodaj użytkownika
        </Button>
      </div>
    </div>
  )
}

export default HeaderSection
