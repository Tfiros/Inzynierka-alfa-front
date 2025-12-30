import { Coins } from 'lucide-react'

export const MainText = () => {
  return (
    <>
      <div className="text-center">
        <div className="flex justify-center items-center gap-2">
          <Coins className="h-6 w-6 text-amber-500" />
          <h1 className="font-semibold">CT Coins – Waluta CrossTrade</h1>
        </div>
        <p className="mt-3 text-sm text-muted-foreground max-w-2xl mx-auto">
          Kup CT Coins aby uzyskać dostęp do funkcji premium, priorytetowego
          wyświetlania ofert i ekskluzywnych możliwości wymiany
        </p>
      </div>
      <div className="mt-6 mb-8 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Wybierz pakiet
        </h2>
      </div>
    </>
  )
}
