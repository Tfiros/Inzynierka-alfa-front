import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { useEffect, useState } from 'react'
import type { AuthModalPropsTypes, AuthModalView } from './ModalTypes'
import { authDescriptions, authTitles } from './AuthConstants'
import LoginModalView from './views/LoginView'
import RegisterModalView from './views/RegisterView'
import RecoveryEmailView from './views/RecoveryEmailView'
import RecoveryCodeView from './views/RecoveryCodeView'
import SuccessChangeView from './views/SuccessChangeView'
import NewPasswordView from './views/NewPasswordView'

const AuthModal = ({ open, onOpenChange }: AuthModalPropsTypes) => {
  const [view, setView] = useState<AuthModalView>('login')
  useEffect(() => {
    if (!open) {
      setView('login')
    }
  }, [open])
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

        {view === 'login' && <LoginModalView onSwitch={setView} />}
        {view === 'register' && <RegisterModalView onSwitch={setView} />}
        {view === 'forgot-email' && <RecoveryEmailView onSwitch={setView} />}
        {view === 'forgot-code' && <RecoveryCodeView onSwitch={setView} />}
        {view === 'forgot-reset' && <NewPasswordView onSwitch={setView} />}
        {view === 'forgot-success' && <SuccessChangeView onSwitch={setView} />}
      </DialogContent>
    </Dialog>
  )
}

export default AuthModal
