import { HttpStatusCode } from "axios"

export interface ApiResult<T = unknown> {
  isSuccess: boolean
  status: HttpStatusCode
  message?: string
  data?: T
}
