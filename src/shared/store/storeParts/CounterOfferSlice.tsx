import type { StateCreator } from "zustand"

export type CounterOfferSlice = {
  counterOfferOpen: boolean
  counterOfferOfferId: number | null
  counterOfferRequest: (offerId: number) => void
  setCounterOfferOpen: (open: boolean) => void
}

type StoreState = CounterOfferSlice & Record<string, unknown>

export const createCounterOfferSlice: StateCreator<
  StoreState,
  [],
  [],
  CounterOfferSlice
> = (set) => ({
  counterOfferOpen: false,
  counterOfferOfferId: null,

  counterOfferRequest: (offerId) =>
    set({
      counterOfferOpen: true,
      counterOfferOfferId: offerId,
    }),

  setCounterOfferOpen: (open) =>
    set(
      open
        ? { counterOfferOpen: true }
        : { counterOfferOpen: false, counterOfferOfferId: null }
    ),
})
