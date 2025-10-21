import { Step } from "../components/Step";
import { Handshake, Search, DownloadCloud } from "lucide-react";

export const HowItWorksSection = () => {
  return (
    <section className="container mx-auto px-4 py-16 lg:py-20">
      <h2 className="text-center text-3xl font-bold">Jak to działa?</h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
        Wymiana itemków między grami nigdy nie była tak prosta. Wystarczą 3 kroki do pierwszej wymiany.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Step
          number="1"
          title="Przeglądaj itemki"
          description="Znajdź itemki z Twoich ulubionych gier wśród tysięcy dostępnych przedmiotów."
          icon={<Search className="h-6 w-6" aria-hidden="true" />}
        />
        <Step
          number="2"
          title="Proponuj wymianę"
          description="Wybierz itemki, które chcesz wymienić i złóż ofertę za pomocą naszej waluty."
          icon={<Handshake className="h-6 w-6" aria-hidden="true" />}
        />
        <Step
          number="3"
          title="Odbierz itemki"
          description="Po akceptacji transakcji przedmioty są automatycznie przenoszone na Twoje konto."
          icon={<DownloadCloud className="h-6 w-6" aria-hidden="true" />}
        />
      </div>
    </section>
  );
};
