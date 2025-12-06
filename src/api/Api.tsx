import axios, { HttpStatusCode} from "axios";
import { useAppStore } from "@/store/appStore";
import type {RawBodyResponse, BodyDetailsResponseDto}  from "@/shared/types/authTypes/AuthErrorTypes";
import type { ApiResult } from "./ApiResult";
type ErrorBody = { message?: string; [k: string]: unknown };

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5277",
  withCredentials: true,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },

});
apiClient.interceptors.request.use((config) => {
  const token = useAppStore.getState().accessToken;
  if (token) {
    if (!config.headers) {
      config.headers = {} as any;
    }
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});


apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError<ErrorBody>(error)) {
      const status =
        (error.response?.status as HttpStatusCode) ??
        HttpStatusCode.InternalServerError;
      const data = error.response?.data as any;

      if (
        data &&
        typeof data === "object" &&
        "isSuccess" in data &&
        "status" in data
      ) {
        return Promise.reject(data as ApiResult<unknown>);
      }

      const raw = data as Partial<RawBodyResponse> | undefined;
      if (raw?.message && raw?.details) {
        return Promise.reject({ status, ...raw });
      }

      const msg = error?.message ?? "Request failed";
      return Promise.reject({
        status,
        message: msg,
        details: { text: msg } as BodyDetailsResponseDto,
      });
    }

    const message =
      error instanceof Error ? error.message : "Unknown error";

    return Promise.reject<ApiResult<never>>({
      isSuccess: false,
      status: HttpStatusCode.InternalServerError,
      message,
    });
  }
);

export default apiClient;