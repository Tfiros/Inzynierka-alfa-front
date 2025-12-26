// #UiSlice
import type { StateCreator } from 'zustand'
import { UserInfoService } from '@/api/services/UserInfoService'
import type { UserNavbarInfoDto } from '@/shared/types/userTypes/UserInfoTypes'

export type UiSlice = {
  counters: Record<string, number>
  inc: (id: string, by?: number) => void
  reset: (id: string) => void
  notify: (msg: string) => string

  // NEW:
  refreshNavbarUserFromAuth: () => Promise<void>
}

type StoreState = UiSlice & {
  // bierzemy z AuthSlice to, co potrzebne:
  userId?: number | null
  setNavbarUser?: (info: UserNavbarInfoDto | null) => void
} & Record<string, unknown>

export const createUiSlice: StateCreator<StoreState, [], [], UiSlice> = (
  set,
  get,
  _api
) => {
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
      console.log('Notification:', msg)
      return msg
    },

    // ✅ NEW: "drugi set navbarUser" bazujący na userId z AuthSlice
    refreshNavbarUserFromAuth: async () => {
      const userId = get().userId ?? null
      if (!userId) {
        // jak nie ma userId, czyścimy
        get().setNavbarUser?.(null)
        return
      }

      const navRes = await UserInfoService.getNavbarInfo(userId)
      if (navRes.isSuccess && navRes.data) {
        // ważne: to ustawi navbarUser + userId (bo setNavbarUser w AuthSlice tak działa)
        get().setNavbarUser?.(navRes.data)
      }
    },
  }
}
