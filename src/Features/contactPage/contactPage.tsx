import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Mail, MessageSquare, User } from "lucide-react"
import { Input } from "@/shared/components/input"
import { Button } from "@/shared/components/button"
import CrossTradeLogo from "@/shared/photos/CrossTradeLogo.png"
import { Label } from "@radix-ui/react-label"
import { Textarea } from "@/shared/components/textarea"

type ContactFormData = {
  name: string
  email: string
  subject: string
  message: string
}

//Backend do napisania i podpięcia, napisanie działania. Jak skończę segregować pliki itd
//zajmę się napisaniem backendu do tego narazie robię po prostu front plus prosta walidacja informacji
//toast jest do powiadomień jezeli zostanie poprawnie wyslany formularz
//potem zostanie do doprecyzowane i odpowiednio podzielone. Narazie jest to frontendowy placeholder
async function sendMessage(_data: ContactFormData): Promise<void> {}

export const ContactPage = () => {
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
    try {
      await sendMessage(data)

      toast.success("Wiadomość wysłana!", {
        description: "Odpowiemy na Twoje pytanie tak szybko, jak to możliwe.",
      })

      reset()
    } catch (e) {
      toast.error("Coś poszło nie tak", {
        description:
          e instanceof Error ? e.message : "Spróbuj ponownie za chwilę.",
      })
    }
  }

  return (
    <section className="w-full max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <img
          src={CrossTradeLogo}
          alt="CROSSTRADE"
          className="mx-auto mb-4 h-30 w-30 object-contain"
        />

        <p className="text-gray-600">
          Masz pytanie? Napisz do nas, a odpowiemy najszybciej jak to możliwe
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
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
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
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
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
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
              className={errors.subject ? "border-red-500" : ""}
            />
            {errors.subject && (
              <p className="text-sm text-red-500">{errors.subject.message}</p>
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
              className={errors.message ? "border-red-500" : ""}
            />
            {errors.message && (
              <p className="text-sm text-red-500">{errors.message.message}</p>
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

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-gray-500 mb-1">Email</div>
              <div className="font-medium break-all text-sm">
                inzynierka.crosstrade.concept@gmail.com
              </div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Telefon</div>
              <div className="font-medium">+48 777 777 777</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Czas odpowiedzi</div>
              <div className="font-medium">24-48 godzin</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
