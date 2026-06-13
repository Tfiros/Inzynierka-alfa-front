import { Mail, MessageSquare, User } from "lucide-react"
import { Input } from "@/shared/components/input"
import { Button } from "@/shared/components/button"
import CrossTradeLogo_light from "@/shared/photos/CrossTradeLogo-light.webp"
import CrossTradeLogo_dark from "@/shared/photos/CrossTradeLogo-Dark.webp"
import { Textarea } from "@/shared/components/textarea"
import { Label } from "@/shared/components/label"
import useContactPage from "./hooks/UseContactPage"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/alert-dialog"

const ContactPage = () => {
  const {
    form,
    setField,
    errors,
    isSubmitting,
    submitError,
    isSuccessModalOpen,
    setIsSuccessModalOpen,
    onSubmit,
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
              <form onSubmit={onSubmit} className="space-y-6" noValidate>
                {submitError && (
                  <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {submitError}
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
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    disabled={isSubmitting}
                    aria-invalid={!!errors.name}
                    className={
                      errors.name
                        ? "border-destructive focus-visible:ring-destructive/30"
                        : ""
                    }
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
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
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    disabled={isSubmitting}
                    aria-invalid={!!errors.email}
                    className={
                      errors.email
                        ? "border-destructive focus-visible:ring-destructive/30"
                        : ""
                    }
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    Temat
                  </Label>
                  <Input
                    id="subject"
                    placeholder="W czym możemy pomóc?"
                    value={form.subject}
                    onChange={(e) => setField("subject", e.target.value)}
                    disabled={isSubmitting}
                    aria-invalid={!!errors.subject}
                    className={
                      errors.subject
                        ? "border-destructive focus-visible:ring-destructive/30"
                        : ""
                    }
                  />
                  {errors.subject && (
                    <p className="text-sm text-destructive">{errors.subject}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Treść</Label>
                  <Textarea
                    id="message"
                    placeholder="Opisz szczegółowo swoją sprawę (min 20 znaków) ..."
                    rows={6}
                    value={form.message}
                    onChange={(e) => setField("message", e.target.value)}
                    disabled={isSubmitting}
                    aria-invalid={!!errors.message}
                    className={
                      errors.message
                        ? "border-destructive focus-visible:ring-destructive/30"
                        : ""
                    }
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive">{errors.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full ${isSubmitting ? "" : "cursor-pointer"}`}
                  size="lg"
                >
                  {isSubmitting ? "Wysyłanie..." : "Wyślij wiadomość"}
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

      <AlertDialog
        open={isSuccessModalOpen}
        onOpenChange={setIsSuccessModalOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Wiadomość wysłana</AlertDialogTitle>
            <AlertDialogDescription>
              Dziękujemy za kontakt. Twoja wiadomość została wysłana. Proszę
              czekaj na kontakt od jednego z naszych pracowników.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogAction
              className="cursor-pointer"
              onClick={() => setIsSuccessModalOpen(false)}
            >
              Zamknij
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default ContactPage
