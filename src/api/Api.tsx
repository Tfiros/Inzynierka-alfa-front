import axios, { HttpStatusCode, type AxiosResponse } from "axios";
import type { ApiResult } from "./ApiResult";
type ErrorBody = { message?: string; [k: string]: unknown };

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5277",
  withCredentials: true,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },

});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => {
    if (axios.isAxiosError<ErrorBody>(error)) {
      const status =
        (error.response?.status as HttpStatusCode) ??
        HttpStatusCode.InternalServerError;

      const message =
        error.response?.data?.message ??
        error.message ??
        "Request failed";

      return Promise.reject<ApiResult<never>>({ status, message });
    }
    const message =
      error instanceof Error ? error.message : "Unknown error";

    return Promise.reject<ApiResult<never>>({
      status: HttpStatusCode.InternalServerError,
      message,
    });
  }
);

export default apiClient;