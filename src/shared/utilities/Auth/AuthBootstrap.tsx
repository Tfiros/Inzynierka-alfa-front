import { useEffect, useState } from "react"
import { useAppStore } from "@/store/appStore"
import { AuthService } from "@/api/services/AuthService"

const base64UrlDecode = (input: string): string => {
  const pad = (s: string) => s + "===".slice((s.length + 3) % 4)
  const b64 = pad(input.replace(/-/g, "+").replace(/_/g, "/"))
  return atob(b64)
}

const parseJwt = (token: string) => {
  try {
    const [, payload] = token.split(".")
    if (!payload) return null
    return JSON.parse(base64UrlDecode(payload))
  } catch {
    return null
  }
}

const isExpired = (token: string, skewMs = 5000): boolean => {
  try {
    const { exp } = parseJwt(token) ?? {}
    return !exp || exp * 1000 < Date.now() + skewMs
  } catch {
    return true
  }
}

export const useAuthBootstrap = (): boolean => {
  const setAccessToken = useAppStore((s) => s.setAccessToken)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    void (async () => {
      try {
        const token = sessionStorage.getItem("accessToken")

        if (token && !isExpired(token)) {
          setAccessToken(token)
          return
        }
        try {
          const refreshed = await AuthService.refresh()
          if (refreshed.data?.accessToken) {
            sessionStorage.setItem("accessToken", refreshed.data?.accessToken)
            setAccessToken(refreshed.data?.accessToken)
            return
          }
        } catch {
          // Refresh nie powiódł się
        }
        sessionStorage.removeItem("accessToken")
        setAccessToken(undefined)
      } finally {
        setReady(true)
      }
    })()
  }, [setAccessToken])

  return ready
}
