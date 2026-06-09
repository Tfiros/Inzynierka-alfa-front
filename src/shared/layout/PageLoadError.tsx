import { Button } from "@/shared/components/button"

const PageLoadError = () => {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 py-24 text-center">
      <p className="text-lg font-semibold">Nie udało się wczytać strony</p>
      <p className="text-sm text-muted-foreground">
        Sprawdź połączenie z internetem i spróbuj ponownie.
      </p>
      <Button onClick={() => window.location.reload()}>Odśwież</Button>
    </div>
  )
}

export default PageLoadError
