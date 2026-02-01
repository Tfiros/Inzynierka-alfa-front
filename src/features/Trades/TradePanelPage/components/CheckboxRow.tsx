type CheckboxRowProps = {
  checked: boolean
  onChange: (v: boolean) => void
  title: string
  description: string
  disabled?: boolean
}

const CheckboxRow = ({
  checked,
  onChange,
  title,
  description,
  disabled,
}: CheckboxRowProps) => (
  <label className="flex items-start justify-between gap-4 rounded-lg border p-3">
    <div>
      <div className="text-sm font-medium">{title}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{description}</div>
    </div>

    <input
      type="checkbox"
      className="mt-1 h-4 w-4 accent-black"
      checked={checked}
      disabled={disabled}
      onChange={(e) => onChange(e.target.checked)}
    />
  </label>
)

export default CheckboxRow
export type { CheckboxRowProps }
