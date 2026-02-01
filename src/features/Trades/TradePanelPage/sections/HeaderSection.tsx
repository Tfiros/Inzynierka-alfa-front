import { Shield } from "lucide-react"
import { useAppStore } from "@/shared/store/appStore"

const HeaderSection = () => {
  const roles = useAppStore((s) => s.roles)
  const isMiddleman = roles.some((r) => r.toLowerCase() === "middleman")
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
        <Shield className="h-5 w-5 text-muted-foreground" />
      </div>
      <div>
        {isMiddleman && (
          <>
            <h1 className="text-2xl font-semibold">Panel Pośrednika</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Zarządzaj bezpiecznymi wymianami między użytkownikami
            </p>
          </>
        )}
        {!isMiddleman && (
          <>
            <h1 className="text-2xl font-semibold">Panel Wymian</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sprawdź status swoich wymian
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default HeaderSection
