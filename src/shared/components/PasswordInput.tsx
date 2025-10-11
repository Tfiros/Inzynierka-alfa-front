import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

const PasswordInput = () => {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <div className="w-full relative">
      <Input
        id="password"
        type={showPassword ? 'text' : 'password'}
        required
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
        tabIndex={-1}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  )
}

export default PasswordInput
