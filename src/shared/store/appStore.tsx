import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { createUiSlice, type UiSlice } from "./storeParts/uiSlice"
import { type AuthSlice, createAuthSlice } from "./storeParts/authSlice"
import {
  type NotificationsSlice,
  createNotificationsSlice,
} from "./storeParts/NotificationSlice"
import { createOfferSlice, type OfferSlice } from "./storeParts/OfferSlice"
export type AppState = UiSlice &
  AuthSlice &
  OfferSlice &
  NotificationsSlice & { hardReset: () => Promise<void> }

export const useAppStore = create<AppState>()(
  persist(
    (set, get, api) => ({
      ...createUiSlice(set, get, api),
      ...createAuthSlice(set, get, api),
      ...createOfferSlice(set, get, api),
      ...createNotificationsSlice(set),
      hardReset: async () => {
        set({
          userLogin: null,
          userId: null,
          navbarUser: null,
          isAuthenticated: false,
          roles: [],
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
      }),
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
