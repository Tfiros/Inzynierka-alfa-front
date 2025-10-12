import PasswordInput from '@/shared/components/PasswordInput'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ModalViewPropsTypes } from '../ModalTypes'

const LoginView = ({ onSwitch }: ModalViewPropsTypes) => {
  return (
    <>
      <form className="gap-y-4 flex flex-col mt-4">
        <div className="gap-y-1 flex flex-col">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required />
        </div>
        <div className="gap-y-1 flex flex-col">
          <Label htmlFor="password">Hasło</Label>
          <PasswordInput />
        </div>
        <div className="flex items-end">
          <button
            onClick={() => onSwitch('forgot-email')}
            className="text-sm font-semibold cursor-pointer"
          >
            Zapomniałeś hasła?
          </button>
        </div>
        <Button type="submit" className="w-full cursor-pointer">
          Zaloguj się
        </Button>
      </form>
      <p className="text-center text-sm mt-4">
        Nie masz konta?{' '}
        <button
          onClick={() => onSwitch('register')}
          className="text-blue-500 cursor-pointer"
        >
          Zarejestruj się
        </button>
      </p>
    </>
  )
}

export default LoginView
