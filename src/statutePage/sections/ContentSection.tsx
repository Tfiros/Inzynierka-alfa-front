import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="scroll-mt-24">
      <h2 className="mb-3 text-xl font-bold tracking-tight">{title}</h2>
      <div className="prose-sm max-w-none text-[15px] leading-7 [&_ol]:space-y-2">
        {children}
      </div>
      <Separator className="my-6" />
    </section>
  )
}

function Definitions({ items }: { items: [string, string][] }) {
  return (
    <dl className="space-y-3">
      {items.map(([term, def]) => (
        <div
          key={term}
          className="grid grid-cols-[140px_1fr] gap-3 max-sm:grid-cols-1"
        >
          <dt className="font-medium">{term}</dt>
          <dd className="text-muted-foreground">{def}</dd>
        </div>
      ))}
    </dl>
  )
}

export function ContentSection() {
  return (
    <Card>
      <CardContent className="p-6 md:p-10 leading-7">
        <Section title="§1. Postanowienia ogólne">
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Regulamin określa zasady korzystania z platformy{' '}
              <strong>CrossTrade</strong> – aplikacji webowej umożliwiającej
              wymianę cyfrowych przedmiotów pomiędzy użytkownikami gier
              komputerowych.
            </li>
            <li>
              Właścicielem i administratorem serwisu jest{' '}
              <em>Aleksander Radoliński, Piotr Wójcik, Igor Tarasiuk</em> .
            </li>
            <li>
              Serwis działa pod adresem: <em>https://crosstrade.pl</em> .
            </li>
            <li>
              Kontakt: <em>"Podać Maila"</em>.
            </li>
            <li>
              Korzystanie z Serwisu oznacza akceptację niniejszego Regulaminu w
              całości.
            </li>
          </ol>
        </Section>

        <Section title="§2. Definicje">
          <Definitions
            items={[
              ['Serwis', 'platforma internetowa CrossTrade'],
              ['Użytkownik', 'osoba fizyczna posiadająca Konto w Serwisie'],
              [
                'Konto',
                'profil Użytkownika umożliwiający korzystanie z funkcji Serwisu',
              ],
              [
                'Przedmiot',
                'cyfrowy przedmiot oferowany do wymiany (np. skin, karta, konto)',
              ],
              [
                'Oferta wymiany',
                'publiczna propozycja zamiany przedmiotów pomiędzy Użytkownikami',
              ],
              [
                'Pośrednik',
                'zatwierdzony przez Administratora mechanizm lub osoba wspierająca bezpieczną wymianę',
              ],
              ['RODO', 'Rozporządzenie (UE) 2016/679'],
            ]}
          />
        </Section>

        <Section title="§3. Zasady korzystania z Serwisu">
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Użytkownik zobowiązuje się do korzystania z Serwisu zgodnie z
              prawem, dobrymi obyczajami i niniejszym Regulaminem.
            </li>
            <li>Rejestracja w Serwisie jest dobrowolna i bezpłatna.</li>
            <li>
              Użytkownik zobowiązuje się do: podawania prawdziwych danych,
              nieudostępniania konta osobom trzecim oraz niezamieszczania treści
              bezprawnych lub obraźliwych.
            </li>
            <li>
              Administrator może zawiesić lub usunąć konto w razie naruszeń.
            </li>
            <li>
              Użytkownik może w każdej chwili usunąć konto, kontaktując się z
              Administratorem.
            </li>
          </ol>
        </Section>

        <Section title="§4. Wystawianie i realizacja ofert wymiany">
          <ol className="list-decimal pl-5 space-y-2">
            <li>Użytkownik tworzy oferty, wskazując „Mam” oraz „Chcę”.</li>
            <li>
              Wymiany mogą odbywać się bezpośrednio lub z udziałem Pośrednika.
            </li>
            <li>
              Administrator nie odpowiada za treść ofert publikowanych przez
              Użytkowników.
            </li>
            <li>
              Serwis nie jest stroną umowy wymiany – zapewnia jedynie
              infrastrukturę techniczną.
            </li>
            <li>
              W przypadku sporu Użytkownicy mogą poprosić Administratora o
              mediację.
            </li>
          </ol>
        </Section>

        <Section title="§5. Bezpieczeństwo i odpowiedzialność">
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Administrator dąży do zapewnienia ciągłości działania Serwisu i
              minimalizacji błędów.
            </li>
            <li>
              Administrator nie ponosi odpowiedzialności za skutki działań
              Użytkowników niezgodnych z Regulaminem, utratę danych spowodowaną
              awarią lub siłą wyższą, ani za transakcje przeprowadzone poza
              platformą.
            </li>
            <li>
              Użytkownik powinien zachować ostrożność i nie udostępniać danych
              logowania osobom trzecim.
            </li>
          </ol>
        </Section>

        <Section title="§6. Dane osobowe i prywatność">
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Administratorem danych osobowych jest Administrator Serwisu.
            </li>
            <li>
              Dane przetwarzane są zgodnie z przepisami RODO i ustawą o ochronie
              danych osobowych.
            </li>
            <li>
              Dane wykorzystywane są w celu obsługi konta, korzystania z Serwisu
              i kontaktu technicznego.
            </li>
            <li>
              Użytkownik ma prawo dostępu, poprawienia, ograniczenia lub
              usunięcia swoich danych.
            </li>
            <li>
              Szczegóły znajdują się w Polityce Prywatności opublikowanej w
              Serwisie.
            </li>
          </ol>
        </Section>

        <Section title="§7. Reklamacje">
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Reklamacje można zgłaszać na adres:{' '}
              <em>reklamacje@crosstrade.pl</em>.
            </li>
            <li>
              Zgłoszenie powinno zawierać nazwę konta, opis problemu i datę
              zdarzenia.
            </li>
            <li>
              Administrator rozpatruje reklamację w ciągu 14 dni roboczych od
              jej otrzymania.
            </li>
            <li>
              Odpowiedź zostanie przesłana na adres e-mail podany przez
              Użytkownika.
            </li>
          </ol>
        </Section>

        <Section title="§8. Prawa autorskie">
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Layout, logotypy, kod źródłowy oraz treści są własnością
              Administratora lub licencjodawców.
            </li>
            <li>
              Zabrania się kopiowania, modyfikowania i rozpowszechniania
              materiałów bez zgody Administratora.
            </li>
          </ol>
        </Section>

        <Section title="§9. Zmiany Regulaminu">
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Administrator zastrzega sobie prawo do zmiany niniejszego
              Regulaminu.
            </li>
            <li>
              O każdej zmianie Użytkownicy zostaną poinformowani z co najmniej
              7-dniowym wyprzedzeniem.
            </li>
            <li>
              Dalsze korzystanie z Serwisu po wprowadzeniu zmian oznacza ich
              akceptację.
            </li>
          </ol>
        </Section>

        <Section title="§10. Postanowienia końcowe">
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              W sprawach nieuregulowanych niniejszym Regulaminem mają
              zastosowanie przepisy prawa polskiego.
            </li>
            <li>Spory będą rozstrzygane przez właściwe sądy powszechne.</li>
            <li>Regulamin wchodzi w życie z dniem publikacji w Serwisie.</li>
          </ol>
        </Section>
      </CardContent>
    </Card>
  )
}
