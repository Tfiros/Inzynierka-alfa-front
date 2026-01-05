import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../shared/components/accordion"

export const FAQs = () => {
  return (
    <div className="bg-background text-foreground">
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-center text-2xl sm:text-3xl font-bold">
          Często zadawane pytania
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">
          Znajdź odpowiedzi na najczęściej zadawane pytania
        </p>

        <div className="mx-auto mt-6 max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger className="cursor-pointer">
                Jak działa CrossTrade?
              </AccordionTrigger>
              <AccordionContent className="text-left">
                Tworzysz ofertę wymiany lub korzystasz z CrossCoins. System
                automatycznie przeprowadza transakcję po akceptacji drugiej
                strony.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q2">
              <AccordionTrigger className="cursor-pointer">
                Czy korzystanie z platformy jest bezpłatne?
              </AccordionTrigger>
              <AccordionContent className="text-left">
                Przeglądanie i wystawianie ofert jest darmowe. Prowizja pojawia
                się dopiero przy finalizacji wymiany / zakupie CrossCoins.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q3">
              <AccordionTrigger className="cursor-pointer">
                Jak zapewniacie bezpieczeństwo transakcji?
              </AccordionTrigger>
              <AccordionContent className="text-left">
                Weryfikujemy konta, monitorujemy anomalie, a escrow trzyma
                przedmioty do czasu akceptacji obu stron.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q4">
              <AccordionTrigger className="cursor-pointer">
                Jakie itemki mogę wymieniać?
              </AccordionTrigger>
              <AccordionContent className="text-left">
                Obsługujemy m.in. CS:GO, Dota 2, Rust, TF2 i kolejne tytuły —
                listę znajdziesz w aplikacji.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q5">
              <AccordionTrigger className="cursor-pointer">
                Czy mogę anulować wymianę?
              </AccordionTrigger>
              <AccordionContent className="text-left">
                Tak, dopóki druga strona nie zaakceptuje transakcji. Po
                akceptacji obowiązują zasady escrow.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  )
}
