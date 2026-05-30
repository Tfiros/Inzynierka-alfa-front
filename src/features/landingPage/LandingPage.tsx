import CTASection from "./sections/CTASection"
import CurrencySection from "./sections/CurrencySection"
import HeroSection from "./sections/HeroSection"
import HowItWorksSection from "./sections/HowItWorksSection"
import KPIsSection from "./sections/KPIsSection"
import TestimonialsSection from "./sections/TestimonialSection"

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeroSection />
      <KPIsSection />
      <HowItWorksSection />
      <CurrencySection />
      <TestimonialsSection />
      <CTASection />
    </div>
  )
}

export default LandingPage
