import { Button } from "@/shared/components/button"
import { useAppStore } from "@/shared/store/appStore"
import { Link } from "react-router-dom"

const CTASection = () => {
  const authRequestRegister = useAppStore((s) => s.authRequestRegister)

  return (
    <section className="container mx-auto px-4 pb-12">
      <div className="mt-10 rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm sm:p-10">
        <h3 className="text-center text-2xl font-semibold">
          Gotowy na pierwszą wymianę?
        </h3>

        <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">
          Dołącz do tysięcy graczy, którzy już odkryli najlepszy sposób na
          wymianę itemków między grami. Zacznij dziś całkowicie za darmo.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button
            size="lg"
            className="cursor-pointer"
            onClick={authRequestRegister}
            aria-label="Zarejestruj się teraz"
          >
            Zarejestruj się teraz
          </Button>

          <Button
            size="lg"
            variant="secondary"
            asChild
            className="cursor-pointer"
          >
            <Link to="/contact" aria-label="Porozmawiaj z nami">
              Porozmawiaj z nami
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default CTASection
