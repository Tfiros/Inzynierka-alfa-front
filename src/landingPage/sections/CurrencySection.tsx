import { Button } from "@/components/ui/button"
import { Handshake, Star, Gift } from "lucide-react"
import { Link } from "react-router-dom"
import Tile from "../components/Tile"

export const CurrencySection = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="rounded-2xl border bg-card/50 p-6 sm:p-10">
        <h2 className="text-center text-2xl sm:text-3xl font-bold">
          CrossCoins – Nasza waluta
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">
          Kup CrossCoins i ułatw sobie wymiany itemków
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Tile
            icon={<Handshake className="h-5 w-5" />}
            title="Łatwe wymiany"
            description="Używaj CrossCoins zamiast bezpośredniej wymiany itemków."
          />
          <Tile
            icon={<Star className="h-5 w-5" />}
            title="Ekskluzywne itemki"
            description="Dostęp do rzadkich przedmiotów dostępnych tylko za CrossCoins."
          />
          <Tile
            icon={<Gift className="h-5 w-5" />}
            title="Bonusy i promocje"
            description="Otrzymuj bonusy za aktywność i udział w promocjach."
          />
        </div>

        <div className="mt-8 flex justify-center">
          <Button asChild className="cursor-pointer">
            <Link to="/">Kup CrossCoins</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
