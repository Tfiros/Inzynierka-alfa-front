import type { AxiosRequestConfig } from "axios";
import api from "./Api";
import type { ApiResult } from "./ApiResult";

type QueryParams = Record<string, string | number | boolean | null | undefined>;

export async function get<T>(
  url: string,
  params?: QueryParams,
  config?: AxiosRequestConfig
): Promise<ApiResult<T>> {
  try {
    const res = await api.get<ApiResult<T>>(url, { params, ...(config ?? {}) });
    return res.data;
  } catch (e) {
    return e as ApiResult<T>;
  }
}

export async function post<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<ApiResult<T>> {
  try {
    const res = await api.post<ApiResult<T>>(url, body, config);
    return res.data;
  } catch (e) {
    return e as ApiResult<T>;
  }
}

export async function put<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<ApiResult<T>> {
  try {
    const res = await api.put<ApiResult<T>>(url, body, config);
    return res.data;
  } catch (e) {
    return e as ApiResult<T>;
  }
}

export async function del<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResult<T>> {
  try {
    const res = await api.delete<ApiResult<T>>(url, config);
    return res.data;
  } catch (e) {
    return e as ApiResult<T>;
  }
}
