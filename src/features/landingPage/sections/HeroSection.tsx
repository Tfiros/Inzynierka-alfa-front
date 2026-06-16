import { Button } from "@/shared/components/button"
import LPPhoto from "@/shared/photos/LandingPageGamesPhoto.webp"
import { useNavigate } from "react-router-dom"
import { useAppStore } from "@/shared/store/appStore"

const HeroSection = () => {
  const navigate = useNavigate()
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)

  const authRequestRegister = useAppStore((s) => s.authRequestRegister)
  return (
    <section className="container mx-auto px-4 pt-16 pb-12 lg:pt-24 lg:pb-20">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h1 className="text-4xl/tight font-extrabold tracking-tight sm:text-5xl">
            Czysta wymiana – <br /> twoje przedmioty, <br /> twój zysk
          </h1>
          <p className="mt-5 max-w-prose text-muted-foreground">
            Odkryj nowy sposób wymiany itemków między grami. Zdobądź upragnione
            skiny, bronie i przedmioty z różnych gier w jednym miejscu.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {!isAuthenticated && (
              <Button className="cursor-pointer" onClick={authRequestRegister}>
                Zacznij teraz za darmo
              </Button>
            )}

            <Button
              size="lg"
              variant="outline"
              className="cursor-pointer"
              onClick={() => navigate("/faqs")}
            >
              Zobacz jak działa
            </Button>
          </div>
        </div>

        <div className="relative">
          <img
            src={LPPhoto}
            alt="Zrzuty ekranów z gier"
            className="w-full rounded-2xl shadow-lg"
          />
        </div>
      </div>
    </section>
  )
}

export default HeroSection
