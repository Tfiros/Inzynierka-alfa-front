import * as signalR from "@microsoft/signalr"
import type { ChatMessageDto } from "@/shared/types/chat/ChatDtos"

export type PresencePayload = { auth0UserId: string; isOnline: boolean }
export type ThreadReadPayload = {
  chatConversationId: number
  lastReadMessageId: number
  unreadCount: number
}
export type MessageUpdatedPayload = {
  id: number
  chatConversationId: number
  message: string
  editedAtUtc?: string | null
}

export type MessageDeletedPayload = {
  messageId: number
}

type Handlers = {
  onPresenceChanged?: (payload: PresencePayload) => void
  onMessageNew?: (payload: any) => void
  onMessageUpdated?: (payload: MessageUpdatedPayload) => void // ✅
  onMessageDeleted?: (payload: MessageDeletedPayload) => void // ✅
}

class ChatHubClient {
  private conn: signalR.HubConnection | null = null
  private starting: Promise<void> | null = null
  private handlers: Handlers = {}

  setHandlers(h: Handlers) {
    this.handlers = h
  }

  private wireHandlersOnce() {
    if (!this.conn) return

    this.conn.on("presence.changed", (p: PresencePayload) =>
      this.handlers.onPresenceChanged?.(p)
    )

    this.conn.on("message.new", (m: any) => this.handlers.onMessageNew?.(m))

    this.conn.on("chat.message.updated", (p: MessageUpdatedPayload) =>
      this.handlers.onMessageUpdated?.(p)
    )

    this.conn.on("chat.message.deleted", (p: MessageDeletedPayload) =>
      this.handlers.onMessageDeleted?.(p)
    )
  }

  async start() {
    if (!this.conn) {
      this.conn = new signalR.HubConnectionBuilder()
        .withUrl("/api/hubs/chat", { withCredentials: true })
        .withAutomaticReconnect()
        .build()

      this.wireHandlersOnce()
    }

    const st = this.conn.state

    // ✅ już działa
    if (st === signalR.HubConnectionState.Connected) return

    // ✅ w trakcie łączenia/reconnectu – nie wołaj start drugi raz
    if (
      st === signalR.HubConnectionState.Connecting ||
      st === signalR.HubConnectionState.Reconnecting
    ) {
      if (this.starting) return this.starting
      // jak nie ma starting (np. reconnect), po prostu czekamy chwilę aż się ustabilizuje
      return
    }

    // ✅ tylko dla Disconnected robimy start
    if (this.starting) return this.starting
    this.starting = this.conn.start().finally(() => (this.starting = null))
    return this.starting
  }

  private async ensureStarted() {
    await this.start()
    if (!this.conn) throw new Error("chat_hub_not_initialized")
  }

  async joinChat(chatId: number) {
    await this.ensureStarted()
    await this.conn!.invoke("JoinChat", chatId)
  }

  async leaveChat(chatId: number) {
    if (!this.conn) return
    await this.conn.invoke("LeaveChat", chatId)
  }

  async sendMessage(chatId: number, text: string) {
    await this.ensureStarted()
    await this.conn!.invoke("SendMessage", chatId, text)
  }
}

export const chatHubClient = new ChatHubClient()
