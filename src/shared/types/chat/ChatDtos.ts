export type ChatMessage = {
  id: number
  chatConversationId: number
  senderId: number
  message: string
  createdAt: string
  editedAt?: string | null

  //Ui-only
  deletedAt?: string | null
}

export type SendMessageRequest = {
  text: string
}

export type ChatThreadListItemDto = {
  chatConversationId: number

  otherUserId: number | null
  otherUserAuth0UserId: string | null
  otherUserNickname: string | null
  otherUserTradeRole: "Buyer" | "Seller" | "Middleman" | null
  avatarUrl: string | null

  isOnline: boolean | null

  lastMessageId: number | null
  lastMessageText: string | null
  lastMessageSenderId: number | null
  lastMessageCreatedAtUtc: string | null // ISO string

  unreadCount: number
  tradeId: number
  closedAtUtc: string | null
}

export type EditMessageRequest = {
  message: string
}

export type MarkReadRequest = {
  lastReadMessageId?: number | null
}

export type ChatReadStateDto = {
  chatConversationId: number
  lastReadMessageId: number
  markedAtUtc: string
  unreadCount: number
}
