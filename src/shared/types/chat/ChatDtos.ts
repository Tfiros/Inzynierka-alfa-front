export type ChatThreadType = "direct" | "group"

export type ChatThreadListItem = {
  chatConversationId: number
  type: ChatThreadType
  title: string
  avatarUrl: string | null
  lastMessagePreview: string | null
  lastMessageAtUtc: string | null
  unreadCount: number
  // dla direct: online status z huba / backendu
  isOnline?: boolean
}

export type ChatMessageSender = {
  auth0UserId: string
  displayName: string
  avatarUrl: string | null
}

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

export type ThreadsResponse = {
  items: ChatThreadListItem[]
}

export type MessagesResponse = {
  items: ChatMessage[]
}

export type SendMessageRequest = {
  text: string
}

export type SendMessageResponse = {
  message: ChatMessage
}

export type CreateDmResponse = {
  chatId: number
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
export type GetMessagesResponse = {
  items: ChatMessage[]
}
