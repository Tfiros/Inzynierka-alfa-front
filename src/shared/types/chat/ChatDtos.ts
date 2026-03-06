export type ChatThreadType = "direct" | "group"

export type ChatThreadListItem = {
  chatId: number
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
  chatId: number
}

export type ChatThreadListItemDto = {
  chatId: number
  title: string
  type: "direct" | "group"
  avatarUrl?: string | null
  lastMessagePreview?: string | null
  lastMessageAtUtc?: string | null
  unreadCount?: number | null
  otherAuth0UserId?: string | null
  isOnline?: boolean | null
}

export type EditMessageRequest = {
  text: string
}

export type MarkReadRequest = {
  lastReadMessageId?: number | null
}

export type ChatReadStateDto = {
  chatId: number
  lastReadMessageId: number
  unreadCount: number
}
export type GetMessagesResponse = {
  items: ChatMessage[]
}
