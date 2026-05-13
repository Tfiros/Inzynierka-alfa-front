export type NotificationDto = {
  id: number
  title: string
  message: string
  createdAt: string
  readAt?: string | null
  isRead: boolean
}

export type GetNotificationsResponse = {
  items: NotificationDto[]
  nextCursorCreatedAt?: string | null
  nextCursorId?: number | null
  hasMore: boolean
}

export type MarkReadManyRequest = {
  ids: number[]
}
