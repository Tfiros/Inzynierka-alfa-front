export type CounterOfferSlice = {
  counterOfferOpen: boolean
  counterOfferOfferId: number | null
  openCounterOffer: (offerId: number) => void
  closeCounterOffer: () => void
  setCounterOfferOpen: (open: boolean) => void
}

export const createCounterOfferSlice = (set: any): CounterOfferSlice => ({
  counterOfferOpen: false,
  counterOfferOfferId: null,

  openCounterOffer: (offerId) =>
    set({
      counterOfferOpen: true,
      counterOfferOfferId: offerId,
    }),

  closeCounterOffer: () =>
    set({
      counterOfferOpen: false,
      counterOfferOfferId: null,
    }),

  setCounterOfferOpen: (open) =>
    set((state: CounterOfferSlice) => ({
      counterOfferOpen: open,
      counterOfferOfferId: open ? state.counterOfferOfferId : null,
    })),
})
