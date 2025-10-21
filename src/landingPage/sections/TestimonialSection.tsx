import { Testimonial } from "../components/Testimonial";

export const TestimonialsSection = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-center text-2xl sm:text-3xl font-bold">
        Co mówią nasi użytkownicy
      </h2>
      <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">
        Przeczytaj opinie osób, które już korzystają z CrossTrade
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Testimonial
          quote="Niesamowita platforma! Wymieniłem skin z CS:GO na fajny nóż w Rust. Szybko, bezpiecznie i bardzo intuicyjnie."
          name="Maciej Gaming"
          role="Pro Gamer"
        />
        <Testimonial
          quote="CrossTrade to rewolucja w świecie gamingu tradingu. Mam dostęp do itemków z różnych gier w jednym miejscu!"
          name="Anna Streamer"
          role="Streamerka"
        />
        <Testimonial
          quote="Jako kolekcjoner itemków gaming, CrossTrade pozwala mi znaleźć rzadkie przedmioty, których nigdzie indziej nie ma."
          name="Tomasz Collector"
          role="Kolekcjoner"
        />
      </div>
    </section>
  );
};
