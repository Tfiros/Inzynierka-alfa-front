import type { StateCreator } from "zustand"

export type UiSlice = {
  counters: Record<string, number>
  inc: (id: string, by?: number) => void
  reset: (id: string) => void
  notify: (msg: string) => string
}

type StoreState = UiSlice & Record<string, unknown>

export const createUiSlice: StateCreator<StoreState, [], [], UiSlice> = (
  set,
  _get,
  _api
) => {
  void _get
  void _api

  return {
    counters: {},

    inc: (id, by = 1) =>
      set((s) => ({
        counters: { ...s.counters, [id]: (s.counters[id] ?? 0) + by },
      })),

    reset: (id) =>
      set((s) => {
        const next = { ...s.counters }
        delete next[id]
        return { counters: next }
      }),

    notify: (msg) => {
      console.log("Notification:", msg)
      return msg
    },
  }
}
