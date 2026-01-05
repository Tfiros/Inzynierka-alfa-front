import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/Dialog"
import type { AuthModalPropsTypes } from "./ModalTypes"
import { authDescriptions, authTitles } from "./AuthConstants"
import LoginModalView from "../../views/LoginView"
import RegisterModalView from "../../views/RegisterView"
import RecoveryEmailView from "../../views/RecoveryEmailView"
import SuccessChangeView from "../../views/SuccessChangeView"

const AuthModal = ({
  open,
  onOpenChange,
  view,
  onViewChange,
}: AuthModalPropsTypes) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl gap-0">
        <DialogHeader className="flex flex-col items-center gap-y-2">
          <img src="/logo.png" alt="Logo" className="w-24 h-24" />
          <div className="w-full flex justify-start flex-col gap-y-2">
            <DialogTitle className="text-xl font-semibold">
              {authTitles[view]}
            </DialogTitle>
            <p className="text-sm text-muted-foreground text-left">
              {authDescriptions[view]}
            </p>
          </div>
        </DialogHeader>

        {view === "login" && <LoginModalView onSwitch={onViewChange} />}
        {view === "register" && <RegisterModalView onSwitch={onViewChange} />}
        {view === "forgot-email" && (
          <RecoveryEmailView onSwitch={onViewChange} />
        )}
        {view === "forgot-success" && (
          <SuccessChangeView onSwitch={onViewChange} />
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AuthModal
