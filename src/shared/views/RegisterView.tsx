import PasswordInput from '@/shared/components/PasswordInput'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { ModalViewPropsTypes } from '../ModalTypes'

const RegisterView = ({ onSwitch }: ModalViewPropsTypes) => {
  const [checked, setChecked] = useState(false)

  return (
    <>
      <form className="gap-y-4 flex flex-col mt-4">
        <div className="gap-y-1 flex flex-col">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required />
        </div>
        <div className="gap-y-1 flex flex-col">
          <Label htmlFor="username">Nazwa Użytkownika</Label>
          <Input id="username" type="text" required />
        </div>
        <div className="gap-y-1 flex flex-col">
          <Label htmlFor="password">Hasło</Label>
          <PasswordInput />
        </div>
        <div className="gap-y-1 flex flex-col">
          <Label htmlFor="confirmPassword">Potwierdź Hasło</Label>
          <PasswordInput />
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={checked}
            onCheckedChange={(val) => setChecked(!!val)}
          />
          <Label htmlFor="terms" className="text-sm">
            Akceptuję
            <a href="#" className="underline">
              Regulamin
            </a>
            oraz
            <a href="#" className="underline">
              Politykę Prywatności
            </a>
            .
          </Label>
        </div>

        <Button type="submit" className="w-full cursor-pointer">
          Zarejestruj się
        </Button>
      </form>
      <p className="text-center text-sm mt-4">
        Masz już konto?{' '}
        <button
          onClick={() => onSwitch('login')}
          className="text-blue-500 cursor-pointer"
        >
          Zaloguj się
        </button>
      </p>
    </>
  )
}

export default RegisterView
