import { Button } from '@/components/ui/button'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { Label } from '@radix-ui/react-label'
import type { ModalViewPropsTypes } from '../ModalTypes'

const RecoveryCodeView = ({ onSwitch }: ModalViewPropsTypes) => {
  return (
    <>
      <form className="gap-y-4 flex flex-col mt-4">
        <div className="gap-y-1 flex flex-col items-center pb-4">
          <Label htmlFor="recovery-code">Kod odzyskiwania</Label>
          <InputOTP maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button
          type="submit"
          className="w-full cursor-pointer"
          onClick={() => onSwitch('forgot-reset')}
        >
          Potwierdź kod
        </Button>
      </form>
    </>
  )
}

export default RecoveryCodeView
