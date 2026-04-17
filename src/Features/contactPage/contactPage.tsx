import { useState } from "react"
import { useForm } from "react-hook-form"
import { Mail, MessageSquare, User } from "lucide-react"
import { Input } from "@/shared/components/input"
import { Button } from "@/shared/components/button"
import CrossTradeLogo_light from "@/shared/photos/CrossTradeLogo-light.png"
import CrossTradeLogo_dark from "@/shared/photos/CrossTradeLogo-Dark.png"
import { Textarea } from "@/shared/components/textarea"
import { Label } from "@/shared/components/label"
import { ContactService } from "@/shared/api/services/ContactService"

type ContactFormData = {
  name: string
  email: string
  subject: string
  message: string
}

const ContactPage = () => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    mode: "onTouched",
  })

  const onSubmit = async (data: ContactFormData) => {
    setSubmitError(null)

    try {
      const result = await ContactService.sendMessage(data)

      if (!result.isSuccess) {
        throw new Error(result.message ?? "Spróbuj ponownie za chwilę.")
      }

      reset()
      setIsSuccessModalOpen(true)
    } catch (e) {
      setSubmitError(
        e instanceof Error ? e.message : "Spróbuj ponownie za chwilę."
      )
    }
  }

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
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
                noValidate
              >
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
                    {...register("name", {
                      required: "Imię i nazwisko jest wymagane",
                      minLength: {
                        value: 2,
                        message: "Imię musi mieć przynajmniej 2 znaki",
                      },
                    })}
                    aria-invalid={!!errors.name}
                    className={
                      errors.name
                        ? "border-destructive focus-visible:ring-destructive/30"
                        : ""
                    }
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">
                      {errors.name.message}
                    </p>
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
                    {...register("email", {
                      required: "Email jest wymagany",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Nieprawidłowy adres email",
                      },
                    })}
                    aria-invalid={!!errors.email}
                    className={
                      errors.email
                        ? "border-destructive focus-visible:ring-destructive/30"
                        : ""
                    }
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
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
                    {...register("subject", {
                      required: "Temat jest wymagany",
                      minLength: {
                        value: 3,
                        message: "Temat musi mieć przynajmniej 3 znaki",
                      },
                    })}
                    aria-invalid={!!errors.subject}
                    className={
                      errors.subject
                        ? "border-destructive focus-visible:ring-destructive/30"
                        : ""
                    }
                  />
                  {errors.subject && (
                    <p className="text-sm text-destructive">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Treść</Label>
                  <Textarea
                    id="message"
                    placeholder="Opisz szczegółowo swoją sprawę (min 20 znaków) ..."
                    rows={6}
                    {...register("message", {
                      required: "Wiadomość jest wymagana",
                      minLength: {
                        value: 20,
                        message: "Wiadomość musi mieć przynajmniej 20 znaków",
                      },
                    })}
                    aria-invalid={!!errors.message}
                    className={
                      errors.message
                        ? "border-destructive focus-visible:ring-destructive/30"
                        : ""
                    }
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
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

      {isSuccessModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setIsSuccessModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-2 text-xl font-semibold">Wiadomość wysłana</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Dziękujemy za kontakt. Twoja wiadomość została wysłana. Proszę
              czekaj na kontakt od jednego z naszych pracowników.
            </p>

            <Button
              type="button"
              className="w-full"
              onClick={() => setIsSuccessModalOpen(false)}
            >
              Zamknij
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

export default ContactPage
