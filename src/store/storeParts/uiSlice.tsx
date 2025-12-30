import { UserInfoService } from '@/api/services/UserInfoService'
import type { UserNavbarInfoDto } from '@/shared/types/userTypes/UserInfoTypes'
import type { StateCreator } from "zustand"

export type UiSlice = {
  counters: Record<string, number>
  inc: (id: string, by?: number) => void
  reset: (id: string) => void
  notify: (msg: string) => string

  refreshNavbarUserFromAuth: () => Promise<void>
}

type StoreState = UiSlice & {
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

    refreshNavbarUserFromAuth: async () => {
      const userId = get().userId ?? null
      if (!userId) {
        get().setNavbarUser?.(null)
        return
      }

      const navRes = await UserInfoService.getNavbarInfo(userId)
      if (navRes.isSuccess && navRes.data) {
        get().setNavbarUser?.(navRes.data)
      }
    },
  }
}
