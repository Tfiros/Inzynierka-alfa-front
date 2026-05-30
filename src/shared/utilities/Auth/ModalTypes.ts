export type AuthModalPropsTypes = {
  open: boolean
  onOpenChange: (open: boolean) => void
  view: AuthModalView
  onViewChange: (view: AuthModalView) => void
}

export type ModalViewPropsTypes = {
  onSwitch: (view: AuthModalView) => void
}

export type AuthModalView =
  | "login"
  | "register"
  | "register-confirm-email"
  | "forgot-email"
  | "forgot-code"
  | "forgot-reset"
  | "forgot-success"
