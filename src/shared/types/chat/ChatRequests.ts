export type GetConversationsQuery = {
  take?: number
}

export type GetMessagesQuery = {
  conversationId: string
  beforeUtc?: string | null
  take?: number
}

export type SendMessageRequest = {
  conversationId: string
  text: string
}
