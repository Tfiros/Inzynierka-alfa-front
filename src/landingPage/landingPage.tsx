import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Handshake, Search, DownloadCloud, Star, Gift } from 'lucide-react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import LPPhoto from '@/photos/LandingPageGamesPhoto.jpg'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="container mx-auto px-4 pt-16 pb-12 lg:pt-24 lg:pb-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="text-4xl/tight font-extrabold tracking-tight sm:text-5xl">
              Czysta wymiana – <br /> twoje przedmioty, <br /> twój zysk
            </h1>
            <p className="mt-5 max-w-prose text-muted-foreground">
              Odkryj nowy sposób wymiany itemków między grami. Zdobądź
              upragnione skiny, bronie i przedmioty z różnych gier w jednym
              miejscu.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Button size="lg">Zacznij teraz za darmo</Button>
              <Button size="lg" variant="outline">
                Zobacz jak działa
              </Button>
            </div>
          </div>

          <div className="relative">
            <img
              src={LPPhoto}
              alt="Ekrany z grami"
              className="w-full rounded-2xl shadow-lg"
            />
          </div>
        </div>

        <div className="mt-12 rounded-xl border bg-card text-card-foreground">
          <div className="grid grid-cols-2 divide-x md:grid-cols-4">
            <Kpi label="Aktywnych użytkowników" value="10k+" />
            <Kpi label="Itemków wymienionych" value="50k+" />
            <Kpi label="Zadowolonych użytkowników" value="98%" />
            <Kpi label="Wsparcie techniczne" value="24/7" hideBorderOnSmall />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 lg:py-20">
        <h2 className="text-center text-3xl font-bold">Jak to działa?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
          Wymiana itemków między grami nigdy nie była tak prosta. Wystarczą 3
          kroki do pierwszej wymiany.
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
            description="Po zaakceptowaniu transakcji przedmioty są automatycznie przenoszone na Twoje konto."
            icon={<DownloadCloud className="h-6 w-6" aria-hidden="true" />}
          />
        </div>
      </section>

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

      <section className="container mx-auto px-4 py-12">
        <div className="rounded-2xl border bg-card/50 p-6 sm:p-10">
          <h2 className="text-center text-2xl sm:text-3xl font-bold">
            CrossCoins – Nasza waluta
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">
            Kup CrossCoins i ułatw sobie wymiany itemków
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Value
              icon={<Handshake className="h-5 w-5" />}
              title="Łatwe wymiany"
              desc="Używaj CrossCoins zamiast bezpośredniej wymiany itemków."
            />
            <Value
              icon={<Star className="h-5 w-5" />}
              title="Ekskluzywne itemki"
              desc="Dostęp do rzadkich przedmiotów dostępnych tylko za CrossCoins."
            />
            <Value
              icon={<Gift className="h-5 w-5" />}
              title="Bonusy i promocje"
              desc="Otrzymuj bonusy za aktywność i udział w promocjach."
            />
          </div>

          <div className="mt-8 flex justify-center">
            <Button asChild>
              <Link to="/">Kup CrossCoins</Link>
            </Button>
          </div>
        </div>
      </section>

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
              <AccordionTrigger>Jak działa CrossTrade?</AccordionTrigger>
              <AccordionContent>
                Tworzysz ofertę wymiany lub korzystasz z CrossCoins. System
                automatycznie przeprowadza transakcję po akceptacji drugiej
                strony.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>
                Czy korzystanie z platformy jest bezpłatne?
              </AccordionTrigger>
              <AccordionContent>
                Przeglądanie i wystawianie ofert jest darmowe. Prowizja pojawia
                się dopiero przy finalizacji wymiany/lub zakupie CrossCoins.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>
                Jak zapewniacie bezpieczeństwo transakcji?
              </AccordionTrigger>
              <AccordionContent>
                Weryfikujemy konta, monitorujemy anomalia i escrow trzyma
                przedmioty do czasu akceptacji obu stron.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>Jakie itemki mogę wymieniać?</AccordionTrigger>
              <AccordionContent>
                Obsługujemy m.in. CS:GO, Dota 2, Rust, TF2 i kolejne tytuły —
                listę znajdziesz w aplikacji.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>Czy mogę anulować wymianę?</AccordionTrigger>
              <AccordionContent>
                Tak, dopóki druga strona nie zaakceptuje transakcji. Po
                akceptacji obowiązują zasady escrow.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <section className="border-t bg-foreground text-background">
        <div className="container mx-auto px-4 py-10">
          <div className="rounded-xl bg-foreground text-background p-6 sm:p-8">
            <h3 className="text-center text-2xl font-semibold">
              Gotowy na pierwszą wymianę?
            </h3>
            <p className="mx-auto mt-2 max-w-2xl text-center opacity-80">
              Dołącz do tysięcy graczy, którzy już odkryli najlepszy sposób na
              wymianę itemków między grami. Zacznij dziś całkowicie za darmo.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button size="lg" asChild>
                <Link to="/app">Zarejestruj się teraz</Link>
              </Button>
              <Button size="lg">
                <Link to="/">Porozmawiaj z nami</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function Kpi({
  value,
  label,
  hideBorderOnSmall,
}: {
  value: string
  label: string
  hideBorderOnSmall?: boolean
}) {
  return (
    <div
      className={[
        'flex flex-col items-center justify-center gap-1 px-4 py-6',
        hideBorderOnSmall ? 'border-0 md:border-0' : '',
      ].join(' ')}
    >
      <div className="text-xl font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground text-center">{label}</div>
    </div>
  )
}

function Step({
  title,
  description,
  icon,
}: {
  number: string
  title: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="mb-4 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border">
            {icon}
          </div>
        </div>

        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border bg-background p-4">
      <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-lg border">
        {icon}
      </div>
      <div>
        <div className="font-medium">{title}</div>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  )
}

function Testimonial({
  quote,
  name,
  role,
}: {
  quote: string
  name: string
  role: string
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div
          className="flex items-center gap-1 text-yellow-500 justify-center "
          aria-hidden="true"
        >
          <Star className="h-4 w-4 fill-current" />
          <Star className="h-4 w-4 fill-current" />
          <Star className="h-4 w-4 fill-current" />
          <Star className="h-4 w-4 fill-current" />
          <Star className="h-4 w-4 fill-current" />
        </div>
        <p className="mt-3 text-sm leading-relaxed">&quot;{quote}&quot;</p>
        <div className="mt-4 text-sm">
          <div className="font-medium">{name}</div>
          <div className="text-muted-foreground">{role}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function Value({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <Card className="h-full">
      <CardContent className="p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border">
          {icon}
        </div>
        <div className="font-semibold">{title}</div>
        <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  )
}
