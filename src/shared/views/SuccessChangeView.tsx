import { Button } from "@/componentsShared/button"
import type { ModalViewPropsTypes } from "../ModalTypes"

const SuccessChangeView = ({ onSwitch }: ModalViewPropsTypes) => {
  return (
    <>
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
