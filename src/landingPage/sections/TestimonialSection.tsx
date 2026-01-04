import { Testimonial } from "../components/Testimonial"

export const TestimonialsSection = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-center text-2xl sm:text-3xl font-bold">
        Co mówią nasi użytkownicy
      </h2>
      <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">
        Przeczytaj opinie osób, które już korzystają z CrossTrade
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3 text-center">
        <Testimonial
          quote="Szybko, bezpiecznie i bardzo intuicyjnie. Właśnie czegoś takiego szukałem"
          name="GoodUncle"
          role="Gracz"
        />
        <Testimonial
          quote="CrossTrade to rewolucja w świecie tradingu dobrami wirtualnymi. Mam dostęp do przedmiotów z różnych gier w jednym miejscu!"
          name="Erson"
          role="Streamer"
        />
        <Testimonial
          quote="CrossTrade pozwala mi znaleźć rzadkie przedmioty, których nigdzie indziej nie ma."
          name="Tfiros"
          role="Kolekcjoner"
        />
      </div>
    </section>
  )
}
