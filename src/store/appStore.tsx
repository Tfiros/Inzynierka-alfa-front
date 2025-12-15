import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { createUiSlice, type UiSlice } from "./storeParts/uiSlice"
import { createAuthSlice, type AuthSlice } from "./storeParts/authSlice"

export type AppState = UiSlice & AuthSlice

export const useAppStore = create<AppState>()(
  persist(
    (set, get, api) => ({
      ...createUiSlice(set, get, api),
      ...createAuthSlice(set, get, api),
    }),
    {
      name: "itemtrade-app",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
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
})
export const selectHasRole = (role: string) => (s: AppState) =>
  s.roles.includes(role)
export const selectAccessToken = (s: AppState) => s.accessToken
