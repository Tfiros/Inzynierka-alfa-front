import * as React from "react"
import { Input } from "@/shared/components/input"
import { Eye, EyeOff } from "lucide-react"

type PasswordInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  errorText?: string
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, errorText, ...props }, ref) => {
    const [show, setShow] = React.useState(false)

    return (
      <div className="relative w-full">
        <Input
          ref={ref}
          type={show ? "text" : "password"}
          className={`pr-10 ${className ?? ""}`}
          {...props}
        />
        <button
          type="button"
          aria-label={show ? "Ukryj hasło" : "Pokaż hasło"}
          aria-pressed={show}
          onClick={() => setShow((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground cursor-pointer"
          tabIndex={-1}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        {errorText && <p className="mt-1 text-xs text-red-600">{errorText}</p>}
      </div>
    )
  }
)

PasswordInput.displayName = "PasswordInput"
export default PasswordInput
