import { cn } from "@/shared/lib/utils"

type Tab<T extends string> = { value: T; label: string }

type Props<T extends string> = {
  value: T
  onChange: (v: T) => void
  tabs: Tab<T>[]
}

const SegmentedTabs = <T extends string>({
  value,
  onChange,
  tabs,
}: Props<T>) => {
  return (
    <div className="rounded-xl bg-muted p-1">
      <div className="grid grid-cols-2 gap-1 md:grid-cols-4">
        {tabs.map((t) => {
          const active = t.value === value
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => onChange(t.value)}
              className={cn(
                "rounded-lg px-3 py-2 text-sm transition",
                active
                  ? "bg-background shadow-sm font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default SegmentedTabs
