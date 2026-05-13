import { del, get, post } from "@/shared/api/ApiClient"
import type {
  GetNotificationsResponse,
  MarkReadManyRequest,
} from "@/shared/types/notificationsTypes/notificationsDtos"

export class NotificationsService {
  private static readonly base = "/Notifications"

  public static readonly getNotifications = async (args: {
    take?: number
    cursorCreatedAt?: string | null
    cursorId?: number | null
  }) =>
    get<GetNotificationsResponse>(this.base, {
      take: args.take ?? 10,
      cursorCreatedAt: args.cursorCreatedAt ?? undefined,
      cursorId: args.cursorId ?? undefined,
    })

  public static readonly markRead = async (id: number) =>
    post<null>(`${this.base}/${id}/read`)

  public static readonly markReadMany = async (req: MarkReadManyRequest) =>
    post<{ updated: number }>(`${this.base}/read`, req)

  public static readonly markReadAll = async () =>
    post<{ updated: number }>(`${this.base}/read-all`)

  public static readonly delete = async (id: number) =>
    del<null>(`${this.base}/${id}`)
}
