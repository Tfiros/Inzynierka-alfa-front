import { Mail, MessageSquare, User } from "lucide-react"
import { Input } from "@/shared/components/input"
import { Button } from "@/shared/components/button"
import CrossTradeLogo_light from "@/shared/photos/CrossTradeLogo-light.webp"
import CrossTradeLogo_dark from "@/shared/photos/CrossTradeLogo-Dark.webp"
import { Textarea } from "@/shared/components/textarea"
import { Label } from "@/shared/components/label"
import useContactPage from "./hooks/UseContactPage"
import SuccessDialog from "./components/SuccessDialog"

const ContactPage = () => {
  const {
    name,
    setName,
    email,
    setEmail,
    subject,
    setSubject,
    message,
    setMessage,
    busy,
    error,
    isSuccessModalOpen,
    setIsSuccessModalOpen,
    submit,
  } = useContactPage()
  return (
    <>
      <section className="w-full">
        <div className="bg-gradient-to-b from-background via-background to-background">
          <div className="mx-auto w-full max-w-3xl px-4 py-16">
            <div className="mb-12 text-center">
              <img
                src={CrossTradeLogo_light}
                alt="CROSSTRADE"
                className="mx-auto mb-4 h-32 w-32 object-contain dark:hidden"
              />
              <img
                src={CrossTradeLogo_dark}
                alt="CROSSTRADE"
                className="mx-auto mb-4 hidden h-32 w-32 object-contain dark:block"
              />

              <p className="text-muted-foreground">
                Masz pytanie? Napisz do nas, a odpowiemy najszybciej jak to
                możliwe
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8 text-card-foreground shadow-sm">
              <form onSubmit={submit} className="space-y-6" noValidate>
                {error && (
                  <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Imię i nazwisko
                  </Label>
                  <Input
                    id="name"
                    placeholder="Jan Kowalski"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={busy}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="twoj@email.pl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={busy}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    Temat
                  </Label>
                  <Input
                    id="subject"
                    placeholder="W czym możemy pomóc?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={busy}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Treść</Label>
                  <Textarea
                    id="message"
                    placeholder="Opisz szczegółowo swoją sprawę (min 20 znaków) ..."
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={busy}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={busy}
                  className={`w-full ${busy ? "" : "cursor-pointer"}`}
                  size="lg"
                >
                  {busy ? "Wysyłanie..." : "Wyślij wiadomość"}
                </Button>
              </form>

              <div className="mt-8 border-t border-border pt-8">
                <div className="grid grid-cols-1 gap-6 text-center md:grid-cols-3">
                  <div>
                    <div className="mb-1 text-sm text-muted-foreground">
                      Email
                    </div>
                    <div className="break-all text-sm font-medium">
                      inzynierka.crosstrade.concept@gmail.com
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-sm text-muted-foreground">
                      Telefon
                    </div>
                    <div className="font-medium">+48 777 777 777</div>
                  </div>
                  <div>
                    <div className="mb-1 text-sm text-muted-foreground">
                      Czas odpowiedzi
                    </div>
                    <div className="font-medium">24-48 godzin</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SuccessDialog
        open={isSuccessModalOpen}
        onOpenChange={setIsSuccessModalOpen}
      />
    </>
  )
}

export default ContactPage
