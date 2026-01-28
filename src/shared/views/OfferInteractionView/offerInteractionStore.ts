import { create } from "zustand"

type Mode = "create" | "edit"

type State = {
  mode: Mode

  interactionOpen: boolean
  setInteractionOpen: (open: boolean) => void

  offerId: number | null

  requestCreate: () => void
  requestEdit: (offerId: number) => void

  deleteConfirmOpen: boolean
  requestDelete: (offerId: number) => void
  setDeleteConfirmOpen: (open: boolean) => void
}

export const useOfferInteractionStore = create<State>((set) => ({
  interactionOpen: false,
  deleteConfirmOpen: false,
  mode: "create",
  offerId: null,

  requestCreate: () => {
    set({
      interactionOpen: true,
      deleteConfirmOpen: false,
      mode: "create",
      offerId: null,
    })
  },

  requestEdit: (offerId) => {
    set({
      interactionOpen: true,
      deleteConfirmOpen: false,
      mode: "edit",
      offerId: offerId,
    })
  },

  requestDelete: (offerId) => {
    set({ deleteConfirmOpen: true, interactionOpen: false, offerId: offerId })
  },

  setInteractionOpen: (open) => {
    set(
      open
        ? { interactionOpen: true, deleteConfirmOpen: false }
        : { interactionOpen: false, mode: "create", offerId: null }
    )
  },

  setDeleteConfirmOpen: (open) => {
    set(
      open
        ? { deleteConfirmOpen: true, interactionOpen: false }
        : { deleteConfirmOpen: false, offerId: null, mode: "create" }
    )
  },
}))
