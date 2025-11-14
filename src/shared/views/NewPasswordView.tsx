import { Button } from '@/components/ui/button'
import { Label } from '@radix-ui/react-label'
import PasswordInput from '@/shared/components/PasswordInput'
import type { ModalViewPropsTypes } from '../ModalTypes'
const NewPasswordView = ({ onSwitch }: ModalViewPropsTypes) => {
  return (
    <>
      <form className="gap-y-4 flex flex-col mt-4">
        <div className="gap-y-1 flex flex-col">
          <Label htmlFor="password">Nowe hasło</Label>
          <PasswordInput />
        </div>
        <div className="gap-y-1 flex flex-col">
          <Label htmlFor="password">Powtórz nowe hasło</Label>
          <PasswordInput />
        </div>
        <Button
          type="submit"
          className="w-full cursor-pointer"
          onClick={() => onSwitch('forgot-success')}
        >
          Zmień hasło
        </Button>
      </form>
    </>
  )
}

export default NewPasswordView
