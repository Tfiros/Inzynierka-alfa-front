export type AuthModalPropsTypes = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialView?: AuthModalView
}

export type ModalViewPropsTypes = {
  onSwitch: (view: AuthModalView) => void
}

export type AuthModalView =
  | "login"
  | "register"
  | "forgot-email"
  | "forgot-code"
  | "forgot-reset"
  | "forgot-success"
