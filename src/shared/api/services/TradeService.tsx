import { post } from "@/shared/api/ApiClient"
import type { CreateTradeRequest } from "@/shared/types/tradeTypes/TradeTypes"

export class TradesService {
  private static readonly base = "/Trades"

  public static readonly create = async (req: CreateTradeRequest) =>
    post<number>(`${this.base}`, req)
}
