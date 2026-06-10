import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { type AuthSlice, createAuthSlice } from "./storeParts/authSlice"
import {
  type NotificationsSlice,
  createNotificationsSlice,
} from "./storeParts/NotificationSlice"
import { createOfferSlice, type OfferSlice } from "./storeParts/OfferSlice"
import { createChatSlice, type ChatSlice } from "./storeParts/ChatSlice"
import { chatHubClient } from "@/shared/api/hubs/ChatHub"
import { createUiSlice, type UiSlice } from "./storeParts/uiSlice"
import {
  createCounterOfferSlice,
  type CounterOfferSlice,
} from "./storeParts/CounterOfferSlice"
import { NotificationsHubClient } from "../api/hubs/NotificationsHubClient"
import {
  createAcceptOfferSlice,
  type AcceptOfferSlice,
} from "./storeParts/AcceptOfferSlice"
import {
  createFavouriteSlice,
  type FavouriteSlice,
} from "./storeParts/FavouriteSlice"

import { tokenRefreshScheduler } from "@/shared/lib/TokenRefreshScheduler"
import { clearCsrfToken } from "@/shared/api/Api"
export type AppState = UiSlice &
  AuthSlice &
  OfferSlice &
  CounterOfferSlice &
  AcceptOfferSlice &
  ChatSlice &
  FavouriteSlice &
  NotificationsSlice & {
    hardReset: () => Promise<void>
    hasHydrated: boolean
    setHasHydrated: (v: boolean) => void
  }

export const useAppStore = create<AppState>()(
  persist(
    (set, get, api) => ({
      ...createUiSlice(set, get, api),
      ...createAuthSlice(set, get, api),
      ...createOfferSlice(set, get, api),
      ...createCounterOfferSlice(set, get, api),
      ...createAcceptOfferSlice(set, get, api),
      ...createNotificationsSlice(set),
      ...createFavouriteSlice(set, get, api),
      ...createChatSlice(set, get, api),

      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),

      hardReset: async () => {
        tokenRefreshScheduler.cancel()
        clearCsrfToken()

        try {
          await chatHubClient.stop()
        } catch (e) {
          console.error("chatHub stop failed", e)
        }

        try {
          await NotificationsHubClient.stop()
        } catch (e) {
          console.error("notificationsHub stop failed", e)
        }

        get().chat?.actions?.resetChat?.()
        get().setNavbarUser(null)

        set({
          userLogin: null,
          isAuthenticated: false,
          roles: [],
          sessionChecked: true,
          counterOfferOpen: false,
          counterOfferOfferId: null,
          darkMode: false,
          notifications: [],
          acceptOfferOpen: false,
          acceptOfferOfferId: null,
          favouriteIds: new Set(),
          favouriteIdsLoaded: false,
        })

        await useAppStore.persist.clearStorage()
      },
    }),
    {
      name: "itemtrade-app",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userLogin: state.userLogin,
        userId: state.userId,
        navbarUser: state.navbarUser,
        isAuthenticated: state.isAuthenticated,
        roles: state.roles,
        darkMode: state.darkMode,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)

export const selectCounter = (id: string) => (s: AppState) =>
  s.counters[id] ?? 0

export const selectIsFavourite = (offerId: number) => (s: AppState) =>
  s.favouriteIds.has(offerId)

export const selectAuth = (s: AppState) => ({
  isAuthenticated: s.isAuthenticated,
  userLogin: s.userLogin,
  userId: s.userId,
  navbarUser: s.navbarUser,
  roles: s.roles,
})

export const selectHasRole = (role: string) => (s: AppState) =>
  s.roles.some((r) => r.toLowerCase() === role.toLowerCase())

export const chatSelectors = {
  isPopoverOpen: (s: AppState) => s.chat.isPopoverOpen,
  isWindowOpen: (s: AppState) => s.chat.isWindowOpen,
  activeChatId: (s: AppState) => s.chat.activeChatId,
  activeChatTitle: (s: AppState) => s.chat.activeChatTitle,
  activeChatTradeId: (s: AppState) => s.chat.activeChatTradeId,
  activeChatClosedAt: (s: AppState) => s.chat.activeChatClosedAt,
  activeChatOtherAuth0UserId: (s: AppState) =>
    s.chat.activeChatOtherAuth0UserId,
  activeChatOtherIsOnline: (s: AppState) => s.chat.activeChatOtherIsOnline,

  threads: (s: AppState) => s.chat.threads,
  messagesByChatId: (s: AppState) => s.chat.messagesByChatId,
  onlineMap: (s: AppState) => s.chat.onlineMap,
  chatActions: (s: AppState) => s.chat.actions,

  totalUnread: (s: AppState) => s.chatUnreadTotal,
}
