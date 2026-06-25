import { UserInfoService } from "@/shared/api/services/UserInfoService"
import type { UserNavbarInfoDto } from "@/shared/types/userTypes/UserInfoTypes"
import type { StateCreator } from "zustand"

export type UiSlice = {
  counters: Record<string, number>
  inc: (id: string, by?: number) => void
  reset: (id: string) => void
  notify: (msg: string) => string
  darkMode: boolean
  setDarkMode: (value: boolean) => void
  refreshNavbarUserFromAuth: () => Promise<void>

  chatThreadIds: number[]
  setChatThreadIds: (ids: number[]) => void

  chatUnreadTotal: number
  unreadChatsLocal: Set<number>

  setCounter: (id: string, value: number) => void

  markChatUnreadLocal: (chatId: number) => void
  markChatReadLocal: (chatId: number) => void
}

type StoreState = UiSlice & {
  userId?: number | null
  setNavbarUser?: (info: UserNavbarInfoDto | null) => void
} & Record<string, unknown>

const uniqPosInts = (ids: number[]): number[] => {
  return Array.from(new Set(ids.filter((x) => Number.isFinite(x) && x > 0)))
}

const normalizeNonNegInt = (v: number) => Math.max(0, Number(v) || 0)

export const createUiSlice: StateCreator<StoreState, [], [], UiSlice> = (
  set,
  get,
  _api
) => {
  void _api

  return {
    counters: {},
    darkMode: false,
    setDarkMode: (value) => set({ darkMode: value }),

    chatUnreadTotal: 0,
    unreadChatsLocal: new Set(),

    chatThreadIds: [],
    setChatThreadIds: (ids) => set({ chatThreadIds: uniqPosInts(ids) }),

    inc: (id, by = 1) =>
      set((s) => ({
        counters: { ...s.counters, [id]: (s.counters[id] ?? 0) + by },
      })),

    setCounter: (id, value) =>
      set((s) => ({
        counters: { ...s.counters, [id]: normalizeNonNegInt(value) },
      })),

    reset: (id) =>
      set((s) => {
        const next = { ...s.counters }
        delete next[id]
        return { counters: next }
      }),

    notify: (msg) => {
      return msg
    },

    markChatUnreadLocal: (chatId) => {
      const id = Number(chatId)
      if (!Number.isFinite(id) || id <= 0) return
      set((s) => {
        if (s.unreadChatsLocal.has(id)) return s

        const next = new Set(s.unreadChatsLocal)
        next.add(id)
        return {
          unreadChatsLocal: next,
          chatUnreadTotal: s.chatUnreadTotal + 1,
        }
      })
    },

    markChatReadLocal: (chatId) => {
      const id = Number(chatId)
      if (!Number.isFinite(id) || id <= 0) return

      set((s) => {
        if (!s.unreadChatsLocal.has(id)) return s

        const next = new Set(s.unreadChatsLocal)
        next.delete(id)
        return {
          unreadChatsLocal: next,
          chatUnreadTotal: Math.max(0, s.chatUnreadTotal - 1),
        }
      })
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
