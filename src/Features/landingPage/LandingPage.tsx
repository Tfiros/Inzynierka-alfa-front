import { HeroSection } from "./sections/HeroSection"
import { KPIsSection } from "./sections/KPIsSection"
import { HowItWorksSection } from "./sections/HowItWorksSection"
import { CurrencySection } from "./sections/CurrencySection"
import { TestimonialsSection } from "./sections/TestimonialSection"
import { CTASection } from "./sections/CTASection"

export const LandingPage = () => {
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
