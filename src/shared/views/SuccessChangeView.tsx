import { Button } from "@/shared/components/button"
import type { ModalViewPropsTypes } from "../utilities/Auth/ModalTypes"

const SuccessChangeView = ({ onSwitch }: ModalViewPropsTypes) => {
  return (
    <>
      Jeśli podany email istnieje w systemie otrzymasz instrukcje resetu hasła
      na skrzynkę mailową.
      <Button
        className="w-full cursor-pointer my-10"
        onClick={() => onSwitch("login")}
      >
        Zaloguj się
      </Button>
    </>
  )
}

export default SuccessChangeView
