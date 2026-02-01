import type { StateCreator } from "zustand"

type Mode = "create" | "edit"

export type OfferSlice = {
  offerMode: Mode
  offerInteractionOpen: boolean
  setOfferInteractionOpen: (open: boolean) => void

  offerId: number | null

  offerRequestCreate: () => void
  offerRequestEdit: (offerId: number) => void

  offerDeleteConfirmOpen: boolean
  offerRequestDelete: (offerId: number) => void
  setOfferDeleteConfirmOpen: (open: boolean) => void
}

type StoreState = OfferSlice & Record<string, unknown>

export const createOfferSlice: StateCreator<StoreState, [], [], OfferSlice> = (
  set
) => ({
  offerInteractionOpen: false,
  offerDeleteConfirmOpen: false,
  offerMode: "create",
  offerId: null,

  offerRequestCreate: () => {
    set({
      offerInteractionOpen: true,
      offerDeleteConfirmOpen: false,
      offerMode: "create",
      offerId: null,
    })
  },
  offerRequestEdit: (offerId) => {
    set({
      offerInteractionOpen: true,
      offerDeleteConfirmOpen: false,
      offerMode: "edit",
      offerId: offerId,
    })
  },
  offerRequestDelete: (offerId) => {
    set({
      offerDeleteConfirmOpen: true,
      offerInteractionOpen: false,
      offerId: offerId,
    })
  },
  setOfferInteractionOpen: (open) => {
    set(
      open
        ? { offerInteractionOpen: true, offerDeleteConfirmOpen: false }
        : { offerInteractionOpen: false, offerMode: "create", offerId: null }
    )
  },
  setOfferDeleteConfirmOpen: (open) => {
    set(
      open
        ? { offerDeleteConfirmOpen: true, offerInteractionOpen: false }
        : { offerDeleteConfirmOpen: false, offerId: null, offerMode: "create" }
    )
  },
})
