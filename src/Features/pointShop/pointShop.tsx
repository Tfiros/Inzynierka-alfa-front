import { Button } from "@/shared/components/button"
import { PackageCard } from "./component/PackageCard"

import { MainText } from "./section/MainText"
import { WhiteCards } from "./section/WhiteCards"
import { BlackCards } from "./section/BlackCards"
import { useState } from "react"
import {
  type PackageKey,
  PACKAGES,
} from "@/shared/types/pointPackagesTypes/PackageItem"

export function PointShop() {
  const [selected, setSelected] = useState<PackageKey>("popular")

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-7xl px-6 py-12">
        <MainText />

        <div className="mt-10 flex justify-center">
          <div className="grid gap-8 lg:grid-cols-[minmax(900px,1fr)_360px]">
            <div className="flex justify-center">
              <div className="grid w-full gap-8 md:grid-cols-2 auto-rows-fr">
                {PACKAGES.map((p) => (
                  <PackageCard
                    key={p.key}
                    item={p}
                    selected={selected === p.key}
                    onSelect={() => setSelected(p.key)}
                  />
                ))}
              </div>
            </div>

            <div className="flex h-full items-center">
              <div className="flex flex-col gap-6">
                <WhiteCards />
                <BlackCards />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <Button className="rounded-xl px-8 h-11">Przejdź do płatności</Button>
        </div>
      </div>
    </div>
  )
}
