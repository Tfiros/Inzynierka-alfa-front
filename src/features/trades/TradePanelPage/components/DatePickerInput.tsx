import * as React from "react"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { CalendarIcon, X } from "lucide-react"

import { Button } from "@/shared/components/button"
import { Calendar } from "@/shared/components/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/popover"
import { cn } from "@/shared/lib/utils"

type Mode = "from" | "to"

type Props = {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  mode?: Mode
}

const isYmd = (v: string) => /^(\d{4})-(\d{2})-(\d{2})$/.test(v)

const parseValueToDate = (v: string): Date | null => {
  if (!v) return null

  if (isYmd(v)) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v)
    if (!m) return null
    const y = Number(m[1])
    const mo = Number(m[2]) - 1
    const d = Number(m[3])
    const dt = new Date(y, mo, d)
    return Number.isNaN(dt.getTime()) ? null : dt
  }

  const dt = new Date(v)
  return Number.isNaN(dt.getTime()) ? null : dt
}

const ymd = (date: Date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

const toUtcIsoRangeEdge = (date: Date, mode: Mode) => {
  const base = ymd(date)
  return mode === "to" ? `${base}T23:59:59.999Z` : `${base}T00:00:00.000Z`
}

const DatePickerInput = ({
  value,
  onChange,
  placeholder = "Wybierz datę",
  disabled,
  className,
  mode = "from",
}: Props) => {
  const selected = React.useMemo(() => parseValueToDate(value), [value])

  const label = React.useMemo(() => {
    if (!selected) return placeholder
    return format(selected, "dd.MM.yyyy", { locale: pl })
  }, [selected, placeholder])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal",
            !selected && "text-muted-foreground",
            className
          )}
        >
          <span className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            {label}
          </span>

          {value ? (
            <span
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onChange("")
              }}
              className="ml-3 inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted cursor-pointer"
              title="Wyczyść"
            >
              <X className="h-4 w-4" />
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected ?? undefined}
          onSelect={(d) => {
            if (!d) return
            onChange(toUtcIsoRangeEdge(d, mode))
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export default DatePickerInput
