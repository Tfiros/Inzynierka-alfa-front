import { get, post, put } from "@/shared/api/ApiClient"

import type {
  AssignMiddlemanRequest,
  TradesQuery,
  UpdateTradeByMiddlemanRequest,
  MiddlemanTradesStats,
  TradeDetailsResponse,
  TradeListItem,
} from "@/shared/types/tradeTypes/MiddlemanTypes"
import type { PagedResponse } from "@/shared/types/PagedType"
export class MiddlemanService {
  private static readonly base = "/Trades"

  private static addParam(
    params: URLSearchParams,
    key: string,
    value: string | number | boolean | null | undefined
  ) {
    if (value === null || value === undefined) return
    if (typeof value === "string" && value.trim().length === 0) return
    params.set(key, String(value))
  }

  private static buildPagedQueryString(
    page: number,
    pageSize: number,
    q?: TradesQuery | null
  ) {
    const params = new URLSearchParams()

    this.addParam(params, "page", page)
    this.addParam(params, "pageSize", pageSize)

    if (q) {
      this.addParam(params, "searchText", q.searchText)
      this.addParam(params, "searchBy", q.searchBy ?? null)

      this.addParam(params, "minTokenCost", q.minTokenCost ?? null)
      this.addParam(params, "maxTokenCost", q.maxTokenCost ?? null)

      this.addParam(params, "createdFrom", q.createdFrom ?? null)
      this.addParam(params, "createdTo", q.createdTo ?? null)

      this.addParam(params, "sortBy", q.sortBy ?? null)

      this.addParam(params, "readyForCompletion", q.readyForCompletion ?? null)
    }

    const qs = params.toString()
    return qs.length > 0 ? `?${qs}` : ""
  }

  public static readonly assignMiddleman = async (
    req: AssignMiddlemanRequest
  ) => post<string>(`${this.base}/assign-middleman`, req)

  public static readonly updateByMiddleman = async (
    tradeId: number,
    req: UpdateTradeByMiddlemanRequest
  ) => put<string>(`${this.base}/update-trade/${tradeId}`, req)

  public static readonly getMiddlemanAvailable = async (
    page: number,
    pageSize: number,
    q?: TradesQuery | null
  ) => {
    const qs = this.buildPagedQueryString(page, pageSize, q)
    return get<PagedResponse<TradeListItem>>(`${this.base}/created${qs}`)
  }

  public static readonly getMiddlemanInRealization = async (
    page: number,
    pageSize: number,
    q?: TradesQuery | null
  ) => {
    const qs = this.buildPagedQueryString(page, pageSize, q)
    return get<PagedResponse<TradeListItem>>(`${this.base}/in-realization${qs}`)
  }

  public static readonly getMiddlemanCompleted = async (
    page: number,
    pageSize: number,
    q?: TradesQuery | null
  ) => {
    const qs = this.buildPagedQueryString(page, pageSize, q)
    return get<PagedResponse<TradeListItem>>(`${this.base}/completed${qs}`)
  }

  public static getMyFailedWithItemsToReturn = async (
    page: number,
    pageSize: number,
    q?: TradesQuery
  ) => {
    const qs = this.buildPagedQueryString(page, pageSize, q)
    return get(`${this.base}/middleman/failed-with-return${qs}`)
  }

  public static readonly setTradeAsFaild = async (tradeId: number) =>
    put<number>(`${this.base}/middleman/${tradeId}/set-as-failed`)

  public static readonly setTradeAsRealised = async (tradeId: number) =>
    put<number>(`${this.base}/middleman/${tradeId}/set-realised`)

  public static readonly getMiddlemanStats = async () =>
    get<MiddlemanTradesStats>(`${this.base}/stats`)

  public static readonly getMiddlemanTradeDetails = async (tradeId: number) =>
    get<TradeDetailsResponse>(`${this.base}/middleman/${tradeId}/details`)
}
