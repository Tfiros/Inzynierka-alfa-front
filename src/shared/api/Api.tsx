import axios, { HttpStatusCode, type AxiosRequestConfig } from "axios"
import type {
  RawBodyResponse,
  BodyDetailsResponseDto,
} from "@/shared/types/authTypes/AuthErrorTypes"
import type { ApiResult } from "./ApiResult"

type ErrorBody = { message?: string; [k: string]: unknown }

let onAuthFailure: (() => Promise<void>) | null = null

export const setAuthFailureHandler = (handler: () => Promise<void>) => {
  onAuthFailure = handler
}

export type ApiClientConfig = AxiosRequestConfig & {
  _retry?: boolean
  skipAuthRefresh?: boolean
  skipCsrfAttach?: boolean
}

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
})

let csrfToken: string | null = null

export const clearCsrfToken = () => {
  csrfToken = null
}

export const hasCsrfToken = () => !!csrfToken

const storeCsrfFromHeaders = (headers: any) => {
  const token = headers?.["x-xsrf-token"]

  if (typeof token === "string" && token.length > 0) {
    csrfToken = token
  }
}

const isAuthEndpoint = (url?: string) => {
  const u = (url ?? "").toLowerCase()

  return (
    u.includes("/auth/login") ||
    u.includes("/auth/register") ||
    u.includes("/auth/forgot-password") ||
    u.includes("/auth/refresh") ||
    u.includes("/auth/logout") ||
    u.includes("/auth/csrf")
  )
}

const isUnsafeMethod = (method?: string) => {
  const m = (method ?? "get").toLowerCase()
  return m === "post" || m === "put" || m === "patch" || m === "delete"
}

api.interceptors.request.use((config) => {
  const cfg = config as ApiClientConfig

  if (!cfg.skipCsrfAttach && isUnsafeMethod(cfg.method) && csrfToken) {
    cfg.headers = cfg.headers ?? {}
    cfg.headers["X-XSRF-TOKEN"] = csrfToken
  }

  return cfg
})

api.interceptors.response.use(
  (response) => {
    storeCsrfFromHeaders(response.headers)
    return response
  },
  async (error) => {
    if (error?.response?.headers) {
      storeCsrfFromHeaders(error.response.headers)
    }

    if (axios.isAxiosError<ErrorBody>(error)) {
      const status =
        (error.response?.status as HttpStatusCode) ??
        HttpStatusCode.InternalServerError

      const originalRequest = (error.config ?? {}) as ApiClientConfig

      const shouldTryRefresh =
        status === HttpStatusCode.Unauthorized &&
        !originalRequest._retry &&
        !originalRequest.skipAuthRefresh &&
        !isAuthEndpoint(originalRequest.url)

      if (shouldTryRefresh) {
        originalRequest._retry = true

        try {
          const refreshRes = await api.post("/Auth/refresh", {}, {
            skipAuthRefresh: true,
          } as ApiClientConfig)

          storeCsrfFromHeaders(refreshRes.headers)

          return api(originalRequest)
        } catch {
          clearCsrfToken()

          if (onAuthFailure) {
            await onAuthFailure()
          }
        }
      }

      const data = error.response?.data as any

      if (
        data &&
        typeof data === "object" &&
        "isSuccess" in data &&
        "status" in data
      ) {
        return Promise.reject(data as ApiResult<unknown>)
      }

      const raw = data as Partial<RawBodyResponse> | undefined

      if (raw?.message && raw?.details) {
        return Promise.reject({ status, ...raw })
      }

      const msg = error.message ?? "Request failed"

      return Promise.reject({
        status,
        message: msg,
        details: { text: msg } as BodyDetailsResponseDto,
      })
    }

    const message = error instanceof Error ? error.message : "Unknown error"

    return Promise.reject<ApiResult<never>>({
      isSuccess: false,
      status: HttpStatusCode.InternalServerError,
      message,
    })
  }
)

export default api
