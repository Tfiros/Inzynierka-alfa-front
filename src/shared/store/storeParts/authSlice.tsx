import type { StateCreator } from "zustand"
import type { UserNavbarInfoDto } from "@/shared/types/userTypes/UserInfoTypes"
import { AuthService } from "@/shared/api/services/AuthService"
import { UserInfoService } from "@/shared/api/services/UserInfoService"
import type { FavouriteSlice } from "./FavouriteSlice"
import { tokenRefreshScheduler } from "@/shared/lib/TokenRefreshScheduler"
import { clearCsrfToken, setAuthFailureHandler } from "@/shared/api/Api"
import type { UiSlice } from "./uiSlice"
import type { AuthModalView } from "@/shared/utilities/Auth/ModalTypes"

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

  authModalOpen: boolean
  authModalView: AuthModalView

  setAuthModalOpen: (open: boolean) => void
  setAuthModalView: (view: AuthModalView) => void
  authRequestLogin: () => void
  authRequestRegister: () => void

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
  UiSlice &
  Record<string, unknown>

export const createAuthSlice: StateCreator<StoreState, [], [], AuthSlice> = (
  set,
  get
) => {
  const clearAuthState = () => {
    tokenRefreshScheduler.cancel()
    clearCsrfToken()

    get().setNavbarUser(null)

    set({
      userLogin: null,
      isAuthenticated: false,
      roles: [],
      sessionChecked: true,
      favouriteIds: new Set(),
      favouriteIdsLoaded: false,
    })
  }

  const loadNavbarInfoIfPossible = async (userId: number | null) => {
    if (!userId) {
      get().setNavbarUser(null)
      return
    }

    const navRes = await UserInfoService.getNavbarInfo(userId)

    if (navRes.isSuccess && navRes.data) {
      get().setNavbarUser(navRes.data)
    } else {
      set({ navbarUser: null })
    }
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

  const scheduleRefreshIfPossible = (expiresIn?: number | null) => {
    if (!expiresIn || expiresIn <= 0) return

    tokenRefreshScheduler.scheduleRefresh(
      expiresIn,
      async () => {
        await get().refresh()
      },
      async () => {
        await get().hardReset()
      }
    )
  }

  return {
    userLogin: null,
    userId: null,
    navbarUser: null,
    isAuthenticated: false,
    roles: [],
    csrfReady: false,
    sessionChecked: false,

    authModalOpen: false,
    authModalView: "login",

    authRequestLogin: () => {
      set({ authModalOpen: true, authModalView: "login" })
    },

    authRequestRegister: () => {
      set({ authModalOpen: true, authModalView: "register" })
    },

    setAuthModalOpen: (open) => {
      set(
        open
          ? { authModalOpen: true }
          : { authModalOpen: false, authModalView: "login" }
      )
    },

    setAuthModalView: (view) => {
      set({ authModalView: view })
    },

    initSecurity: async () => {
      await initSecurityOnce()

      setAuthFailureHandler(async () => {
        await get().hardReset()
      })
    },

    setNavbarUser: (info) => {
      var ids = (info?.chatUnreadIds ?? [])
        .map((x) => Number(x))
        .filter((x) => Number.isFinite(x) && x > 0)
      const unreadIds = new Set<number>(ids)
      set({
        navbarUser: info,
        userId: info?.id ?? null,
        chatUnreadTotal: unreadIds.size,
        unreadChatsLocal: unreadIds,
      })
      get().setChatThreadIds(info?.chatIds ?? [])
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

      set({
        userId: (res.data as any).id ?? null,
        sessionChecked: false,
      })

      scheduleRefreshIfPossible((res.data as any).expiresIn)

      await get().syncSession()
      if (get().isAuthenticated) {
        set({ authModalOpen: false, authModalView: "login" })
      }
    },

    refresh: async () => {
      const res = await AuthService.refresh()

      if (!res.isSuccess || !res.data) {
        throw new Error(res.message || "Nie udało się odświeżyć sesji.")
      }

      set({
        userId: (res.data as any).id ?? null,
        sessionChecked: false,
      })

      scheduleRefreshIfPossible((res.data as any).expiresIn)

      await get().syncSession()
    },

    logout: async () => {
      tokenRefreshScheduler.cancel()
      clearCsrfToken()

      await AuthService.logout().catch(() => {})

      await get().hardReset()
    },
  }
}
