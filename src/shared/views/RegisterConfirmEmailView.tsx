import { Button } from "@/shared/components/button"
import type { ModalViewPropsTypes } from "../utilities/Auth/ModalTypes"

const RegisterConfirmEmailView = ({ onSwitch }: ModalViewPropsTypes) => {
  return (
    <div className="flex flex-col gap-y-4 mt-4 text-center">
      <div className="flex flex-col gap-y-2">
        <h3 className="text-lg font-semibold">Potwierdź adres email</h3>

        <p className="text-sm text-muted-foreground">
          Konto zostało utworzone. Aby móc się zalogować, potwierdź adres email
          klikając link wysłany na Twoją skrzynkę.
        </p>
      </div>

      <Button
        type="button"
        className="w-full cursor-pointer"
        onClick={() => onSwitch("login")}
      >
        Zaloguj się
      </Button>
    </div>
  )
}

export default RegisterConfirmEmailView
