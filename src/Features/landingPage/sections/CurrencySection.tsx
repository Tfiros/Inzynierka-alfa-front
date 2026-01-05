import { Button } from "@/shared/components/Button"
import { Handshake, Star, Gift } from "lucide-react"
import Tile from "../components/Tile"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import type { AuthModalView } from "@/shared/utilities/Auth/ModalTypes"
import AuthModal from "@/shared/utilities/Auth/AuthModal"
import { useAppStore } from "@/shared/store/AppStore"

export const CurrencySection = () => {
  const navigate = useNavigate()
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)

  const [open, setOpen] = useState(false)
  const [view, setView] = useState<AuthModalView>("login")

  return (
    <>
      <section className="container mx-auto px-4 py-12">
        <div className="rounded-2xl border bg-card/50 p-6 sm:p-10">
          <h2 className="text-center text-2xl sm:text-3xl font-bold">
            CrossCoins – Nasza waluta
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">
            Kup CrossCoins i ułatw sobie wymiany itemków
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3 text-center">
            <Tile
              icon={<Handshake className="h-5 w-5" />}
              title="Łatwe wymiany"
              description="Używaj CrossCoins zamiast bezpośredniej wymiany itemków."
            />
            <Tile
              icon={<Star className="h-5 w-5" />}
              title="Większa widoczność"
              description="Moliwość promowania wystawionych ofert."
            />
            <Tile
              icon={<Gift className="h-5 w-5" />}
              title="Mozliwosc składania kontroferty"
              description="Składaj kontroferty do wystawionych juz ofert."
            />
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              className="cursor-pointer"
              onClick={() => {
                if (!isAuthenticated) {
                  setView("login")
                  setOpen(true)
                  return
                }
                navigate("/shop")
              }}
            >
              Kup CrossCoins
            </Button>
          </div>
        </div>
      </section>

      <AuthModal
        open={open}
        onOpenChange={setOpen}
        view={view}
        onViewChange={setView}
      />
    </>
  )
}
