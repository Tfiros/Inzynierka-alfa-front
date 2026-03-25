export type ChatThreadType = "direct" | "group"

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

export type CreateDmChatResponse = {
  chatConversationId: number
}

export type ChatThreadListItemDto = {
  chatConversationId: number
  isGroup: boolean
  displayName: string

  otherUserId: number
  otherUserAuth0UserId: string
  avatarUrl: string

  isOnline: boolean

  lastMessageId: number
  lastMessageText: string
  lastMessageSenderId: number
  lastMessageCreatedAtUtc: string // ISO string

  unreadCount: number
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
