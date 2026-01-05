import { Handshake, Search, DownloadCloud } from "lucide-react"
import Tile from "../components/Tile"

const HowItWorksSection = () => {
  return (
    <section className="container mx-auto px-4 py-16 lg:py-20">
      <h2 className="text-center text-3xl font-bold">Jak to działa?</h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
        Wymiana przedmiotów między grami nigdy nie była tak prosta.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-center">
        <Tile
          title="Przeglądaj przedmioty"
          description="Znajdź przedmioty z Twoich ulubionych gier wśród tysięcy dostępnych przedmiotów."
          icon={<Search className="h-6 w-6" aria-hidden="true" />}
        />
        <Tile
          title="Proponuj wymianę"
          description="Wybierz przedmioty, które chcesz wymienić i złóż ofertę."
          icon={<Handshake className="h-6 w-6" aria-hidden="true" />}
        />
        <Tile
          title="Odbierz przedmioty"
          description="Po akceptacji transakcji rozpoczyna się proces wymiany. Nasi ludzie zadbają o pełne bezpieczeństwo twojej wymiany."
          icon={<DownloadCloud className="h-6 w-6" aria-hidden="true" />}
        />
      </div>
    </section>
  )
}

export default HowItWorksSection
