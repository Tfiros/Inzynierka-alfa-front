import { Shield } from "lucide-react"

const HeaderSection = () => {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
        <Shield className="h-5 w-5 text-muted-foreground" />
      </div>

      <div>
        <h1 className="text-2xl font-semibold">Panel Pośrednika</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Zarządzaj bezpiecznymi wymianami między użytkownikami
        </p>
      </div>
    </div>
  )
}
export default HeaderSection
