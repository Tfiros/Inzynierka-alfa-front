import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import type { ModalViewPropsTypes } from '../ModalTypes'

const RecoveryEmailView = ({ onSwitch }: ModalViewPropsTypes) => {
  return (
    <>
      <form className="gap-y-4 flex flex-col mt-4">
        <div className="gap-y-1 flex flex-col">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required />
        </div>
        <Button
          type="submit"
          className="w-full cursor-pointer"
          onClick={() => onSwitch('forgot-code')}
        >
          Odzyskaj hasło
        </Button>
      </form>
    </>
  )
}

export default RecoveryEmailView
