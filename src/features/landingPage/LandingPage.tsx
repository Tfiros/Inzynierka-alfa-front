import { useState } from "react"
import CTASection from "./sections/CTASection"
import CurrencySection from "./sections/CurrencySection"
import HeroSection from "./sections/HeroSection"
import HowItWorksSection from "./sections/HowItWorksSection"
import KPIsSection from "./sections/KPIsSection"
import TestimonialsSection from "./sections/TestimonialSection"
import AuthModal from "@/shared/utilities/Auth/AuthModal"
import type { AuthModalView } from "@/shared/utilities/Auth/ModalTypes"

const LandingPage = () => {
  const [authOpen, setAuthOpen] = useState(false)
  const [authView, setAuthView] = useState<AuthModalView>("register")

  const openRegisterModal = () => {
    setAuthView("register")
    setAuthOpen(true)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeroSection />
      <KPIsSection />
      <HowItWorksSection />
      <CurrencySection />
      <TestimonialsSection />

      <CTASection onRegisterClick={openRegisterModal} />

      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        view={authView}
        onViewChange={setAuthView}
      />
    </div>
  )
}

export default LandingPage
