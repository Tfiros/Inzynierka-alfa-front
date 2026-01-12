import { CheckCircle2, XCircle } from "lucide-react"

type FlagProps = {
  ok: boolean
  label: string
}

const Flag = ({ ok, label }: FlagProps) => (
  <div className="flex items-center gap-2 text-sm">
    {ok ? (
      <CheckCircle2 className="h-4 w-4" />
    ) : (
      <XCircle className="h-4 w-4" />
    )}
    <span>{label}</span>
  </div>
)

export default Flag
export type { FlagProps }
