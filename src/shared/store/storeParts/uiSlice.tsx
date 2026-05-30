import { UserInfoService } from "@/shared/api/services/UserInfoService"
import type { UserNavbarInfoDto } from "@/shared/types/userTypes/UserInfoTypes"
import type { StateCreator } from "zustand"
const unreadChatsLocal = new Set<number>()

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

  setCounter: (id: string, value: number) => void

  markChatUnreadLocal: (chatId: number) => void
  markChatReadLocal: (chatId: number) => void
  clearUnreadChatsLocal: () => void
}

type StoreState = UiSlice & {
  userId?: number | null
  setNavbarUser?: (info: UserNavbarInfoDto | null) => void
} & Record<string, unknown>

const uniqPosInts = (ids: any): number[] => {
  return Array.from(
    new Set(
      (ids ?? [])
        .map((x: any) => Number(x))
        .filter((x: number) => Number.isFinite(x) && x > 0)
    )
  )
}

const normalizeNonNegInt = (v: any) => Math.max(0, Number(v) || 0)

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
      if (unreadChatsLocal.has(id)) return

      unreadChatsLocal.add(id)

      set((s) => ({
        counters: {
          ...s.counters,
          chat_unread_total: (s.counters.chat_unread_total ?? 0) + 1,
        },
      }))
    },

    markChatReadLocal: (chatId) => {
      const id = Number(chatId)
      if (!Number.isFinite(id) || id <= 0) return
      if (!unreadChatsLocal.has(id)) return

      unreadChatsLocal.delete(id)

      set((s) => ({
        counters: {
          ...s.counters,
          chat_unread_total: Math.max(
            0,
            (s.counters.chat_unread_total ?? 0) - 1
          ),
        },
      }))
    },

    clearUnreadChatsLocal: () => {
      unreadChatsLocal.clear()
      set((s) => ({
        counters: { ...s.counters, chat_unread_total: 0 },
      }))
    },

    refreshNavbarUserFromAuth: async () => {
      const userId = get().userId ?? null
      if (!userId) {
        get().setNavbarUser?.(null)
        get().setChatThreadIds([])
        unreadChatsLocal.clear()
        set((s) => ({ counters: { ...s.counters, chat_unread_total: 0 } }))
        return
      }

      const navRes = await UserInfoService.getNavbarInfo(userId)
      if (navRes.isSuccess && navRes.data) {
        get().setNavbarUser?.(navRes.data)
        get().setChatThreadIds(navRes.data.chatIds ?? [])
        unreadChatsLocal.clear()

        const total = normalizeNonNegInt(navRes.data.chatUnreadTotal)
        set((s) => ({
          counters: { ...s.counters, chat_unread_total: total },
        }))
      }
    },
  }
}
