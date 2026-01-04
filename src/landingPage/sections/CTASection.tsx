import { Button } from "@/componentsShared/button"
import { Link } from "react-router-dom"

export const CTASection = () => {
  return (
    <section className="border-t bg-foreground text-background">
      <div className="container mx-auto px-4 py-10">
        <div className="rounded-xl bg-foreground p-6 text-background sm:p-8">
          <h3 className="text-center text-2xl font-semibold">
            Gotowy na pierwszą wymianę?
          </h3>
          <p className="mx-auto mt-2 max-w-2xl text-center opacity-80">
            Dołącz do tysięcy graczy, którzy już odkryli najlepszy sposób na
            wymianę itemków między grami. Zacznij dziś całkowicie za darmo.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild className="cursor-pointer">
              <Link to="/app" aria-label="Zarejestruj się teraz">
                Zarejestruj się teraz
              </Link>
            </Button>
            <Button
              size="lg"
              asChild
              variant="secondary"
              className="cursor-pointer"
            >
              <Link to="/contact" aria-label="Porozmawiaj z nami">
                Porozmawiaj z nami
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
