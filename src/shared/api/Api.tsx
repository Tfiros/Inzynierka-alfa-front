import axios, { HttpStatusCode, type AxiosRequestConfig } from "axios"
import type {
  RawBodyResponse,
  BodyDetailsResponseDto,
} from "@/shared/types/authTypes/AuthErrorTypes"
import type { ApiResult } from "./ApiResult"

import { RateLimiter, parseRetryAfterToMs } from "./RateLimiter"

type ErrorBody = { message?: string; [k: string]: unknown }

export type ApiClientConfig = AxiosRequestConfig & {
  _retry?: boolean
  skipAuthRefresh?: boolean
  skipCsrfAttach?: boolean
  skipRateLimit?: boolean
  __rl_key?: string
}

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
})

/*To Do:
- Test to find the best values
*/
const limiter = new RateLimiter({
  maxRequests: 3,
  perMilliseconds: 1000,
  maxConcurrent: 6,
})

let csrfToken: string | null = null

export const clearCsrfToken = () => {
  csrfToken = null
}

export const hasCsrfToken = () => !!csrfToken

const storeCsrfFromHeaders = (headers: any) => {
  const t = headers?.["x-xsrf-token"]
  if (typeof t === "string" && t.length > 0) csrfToken = t
}

const isAuthEndpoint = (url?: string) => {
  const u = (url ?? "").toLowerCase()
  return (
    u.includes("/auth/login") ||
    u.includes("/auth/register") ||
    u.includes("/auth/forgot-password") ||
    u.includes("/auth/refresh") ||
    u.includes("/auth/logout") ||
    u.includes("/auth/me") ||
    u.includes("/auth/csrf")
  )
}

const isUnsafeMethod = (method?: string) => {
  const m = (method ?? "get").toLowerCase()
  return m === "post" || m === "put" || m === "patch" || m === "delete"
}

api.interceptors.request.use(async (config) => {
  const cfg = config as ApiClientConfig
  const method = (cfg.method ?? "get").toLowerCase()
  const url = cfg.url ?? ""
  const key = `${method}:${url}`

  const shouldRateLimit = !cfg.skipRateLimit

  if (shouldRateLimit) {
    await limiter.schedule(key)
    cfg.__rl_key = key
  }

  if (!cfg.skipCsrfAttach && isUnsafeMethod(cfg.method) && csrfToken) {
    cfg.headers = cfg.headers ?? {}
    cfg.headers["X-XSRF-TOKEN"] = csrfToken
  }

  return cfg
})

api.interceptors.response.use(
  (response) => {
    storeCsrfFromHeaders(response.headers)

    const cfg = response.config as ApiClientConfig
    if (cfg.__rl_key) limiter.release(cfg.__rl_key)

    return response
  },
  async (error) => {
    if (error?.response?.headers) storeCsrfFromHeaders(error.response.headers)

    const errCfg = (error?.config ?? {}) as ApiClientConfig
    if (errCfg.__rl_key) limiter.release(errCfg.__rl_key)

    if (axios.isAxiosError(error)) {
      const status = error.response?.status

      /* Auto learn limiter
      We can keep it or delet it.
      */
      if (status === 429 && errCfg.__rl_key) {
        const ra = parseRetryAfterToMs(error.response?.headers?.["retry-after"])
        limiter.setCooldown(errCfg.__rl_key, ra ?? 1500, "HTTP 429")
      }
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
        !isAuthEndpoint(originalRequest.url) &&
        !!csrfToken

      if (shouldTryRefresh) {
        originalRequest._retry = true
        try {
          const refreshRes = await api.post("/Auth/refresh", {}, {
            skipAuthRefresh: true,
            skipRateLimit: true,
          } as ApiClientConfig)

          storeCsrfFromHeaders(refreshRes.headers)

          return api(originalRequest)
        } catch {
          // clearCsrfToken()
          // todo
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
