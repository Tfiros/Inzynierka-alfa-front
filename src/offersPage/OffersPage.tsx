import React from 'react'
import FilterBar from './components/FilterBar'

const OffersPage = () => {
  const oferty = 15
  return (
    <div className="mx-auto flex flex-col gap-6  py-6 lg:py-10">
      <header className="flex flex-col gap-3 pb-2 md:flex-row md:items-center md:justify-between">
        <div className="text-left">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Marketplace
          </h1>
          <p className="text-muted-foreground">
            Przeglądaj oferty wymiany i znajdź najlepsze okazje!
          </p>
        </div>
        <div className="text-sm text-muted-foreground md:text-right md:self-end">
          <p>{oferty} znalezionych ofert</p>
        </div>
      </header>
      <FilterBar />
    </div>
  )
}

export default OffersPage
