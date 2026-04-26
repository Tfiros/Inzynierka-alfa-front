import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { type AuthSlice, createAuthSlice } from "./storeParts/authSlice"
import {
  type NotificationsSlice,
  createNotificationsSlice,
} from "./storeParts/NotificationSlice"
import { createOfferSlice, type OfferSlice } from "./storeParts/OfferSlice"

import { createUiSlice, type UiSlice } from "./storeParts/uiSlice"
import {
  createCounterOfferSlice,
  type CounterOfferSlice,
} from "./storeParts/CounterOfferSlice"

export type AppState = UiSlice &
  AuthSlice &
  NotificationsSlice &
  OfferSlice &
  CounterOfferSlice & {
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
      ...createCounterOfferSlice(set),
      ...createNotificationsSlice(set),
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),

      hardReset: async () => {
        set({
          userLogin: null,
          userId: null,
          navbarUser: null,
          isAuthenticated: false,
          roles: [],
          counterOfferOpen: false,
          counterOfferOfferId: null,
        })

        await useAppStore.persist.clearStorage()
      },
    }),
    {
      name: "itemtrade-app",
      storage: createJSONStorage(() => sessionStorage),
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

export const selectAuth = (s: AppState) => ({
  isAuthenticated: s.isAuthenticated,
  userLogin: s.userLogin,
  userId: s.userId,
  navbarUser: s.navbarUser,
  roles: s.roles,
})

export const selectHasRole = (role: string) => (s: AppState) =>
  s.roles.some((r) => r.toLowerCase() === role.toLowerCase())
