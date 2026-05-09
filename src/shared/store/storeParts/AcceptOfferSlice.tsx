import type { StateCreator } from "zustand"

export type AcceptOfferSlice = {
  acceptOfferOpen: boolean
  acceptOfferOfferId: number | null
  acceptOfferRequest: (offerId: number) => void
  setAcceptOfferOpen: (open: boolean) => void
}

type StoreState = AcceptOfferSlice & Record<string, unknown>

export const createAcceptOfferSlice: StateCreator<
  StoreState,
  [],
  [],
  AcceptOfferSlice
> = (set) => ({
  acceptOfferOpen: false,
  acceptOfferOfferId: null,

  acceptOfferRequest: (offerId) => {
    set({
      acceptOfferOpen: true,
      acceptOfferOfferId: offerId,
    })
  },

  setAcceptOfferOpen: (open) => {
    set(
      open
        ? { acceptOfferOpen: true }
        : { acceptOfferOpen: false, acceptOfferOfferId: null }
    )
  },
})
