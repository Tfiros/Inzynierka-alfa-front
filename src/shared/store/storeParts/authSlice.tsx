import type { StateCreator } from "zustand"
import type { UserNavbarInfoDto } from "@/shared/types/userTypes/UserInfoTypes"
import { AuthService } from "@/shared/api/services/AuthService"
import { UserInfoService } from "@/shared/api/services/UserInfoService"
import { FavouriteService } from "@/shared/api/services/FavouriteService"
import type { FavouriteSlice } from "./FavouriteSlice"

export type AuthMeDto = {
  isAuthenticated: boolean
  login: string | null
  roles: string[]
  userId: number | null
}

export type AuthSlice = {
  userLogin: string | null
  userId: number | null
  navbarUser: UserNavbarInfoDto | null
  isAuthenticated: boolean
  roles: string[]

  sessionChecked: boolean

  csrfReady: boolean
  initSecurity: () => Promise<void>
  setNavbarUser: (info: UserNavbarInfoDto | null) => void
  syncSession: () => Promise<void>

  login: (email: string, password: string) => Promise<void>
  refresh: () => Promise<void>
  logout: () => Promise<void>
}

type HasHardReset = { hardReset: () => Promise<void> }
type StoreState = AuthSlice &
  HasHardReset &
  FavouriteSlice &
  Record<string, unknown>

export const createAuthSlice: StateCreator<StoreState, [], [], AuthSlice> = (
  set,
  get
) => {
  const clearAuthState = () => {
    set({
      userLogin: null,
      isAuthenticated: false,
      roles: [],
      userId: null,
      navbarUser: null,
    })
    get().setFavouriteIds([])
  }

  const loadNavbarInfoIfPossible = async (userId: number | null) => {
    if (!userId) {
      set({ navbarUser: null })
      return
    }

    const navRes = await UserInfoService.getNavbarInfo(userId)
    if (navRes.isSuccess && navRes.data) set({ navbarUser: navRes.data })
    else set({ navbarUser: null })
  }

  const loadFavouriteOffers = async (userId: number | null) => {
    const setFavouriteIds = get().setFavouriteIds
    if (!userId) {
      setFavouriteIds([])
      return
    }

    const favRes = await FavouriteService.getFavouriteIds()
    setFavouriteIds(favRes.isSuccess && favRes.data ? favRes.data : [])
  }

  const initSecurityOnce = async () => {
    if (get().csrfReady) return
    set({ csrfReady: true })

    try {
      await AuthService.csrf()
    } catch {
      set({ csrfReady: false })
    }
  }

  return {
    userLogin: null,
    userId: null,
    navbarUser: null,
    isAuthenticated: false,
    roles: [],
    csrfReady: false,

    sessionChecked: false,

    initSecurity: async () => {
      await initSecurityOnce()
    },

    setNavbarUser: (info) => {
      set({
        navbarUser: info,
        userId: info?.id ?? null,
      })
    },

    syncSession: async () => {
      try {
        const meRes = await AuthService.me<AuthMeDto>()

        if (!meRes?.isSuccess || !meRes.data || !meRes.data.isAuthenticated) {
          clearAuthState()
          return
        }

        const backendUserId = meRes.data.userId ?? null
        const finalUserId = backendUserId ?? get().userId ?? null

        set({
          isAuthenticated: true,
          userLogin: meRes.data.login ?? null,
          roles: Array.isArray(meRes.data.roles) ? meRes.data.roles : [],
          userId: finalUserId,
        })

        await loadNavbarInfoIfPossible(finalUserId)
        await loadFavouriteOffers(finalUserId)
      } catch (e) {
        console.error("[syncSession] failed", e)
        clearAuthState()
      } finally {
        set({ sessionChecked: true })
      }
    },

    login: async (email, password) => {
      const res = await AuthService.login({ email, password })

      if (!res.isSuccess || !res.data) {
        throw new Error(res.message || "Nieznany błąd podczas logowania.")
      }

      set({ userId: (res.data as any).id ?? null, sessionChecked: false })

      await get().syncSession()
    },

    refresh: async () => {
      const res = await AuthService.refresh()
      if (!res.isSuccess || !res.data) {
        throw new Error(res.message || "Nie udało się odświeżyć sesji.")
      }

      set({ userId: (res.data as any).id ?? null, sessionChecked: false })
      await get().syncSession()
    },

    logout: async () => {
      await AuthService.logout().catch(() => {})
      await get().hardReset()
    },
  }
}
