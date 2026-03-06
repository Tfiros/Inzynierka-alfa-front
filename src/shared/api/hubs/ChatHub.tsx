import * as signalR from "@microsoft/signalr"
import type { ChatMessage } from "@/shared/types/chat/ChatDtos"

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
  onMessageNew?: (payload: ChatMessage | any) => void
  onMessageUpdated?: (payload: MessageUpdatedPayload) => void
  onMessageDeleted?: (payload: MessageDeletedPayload) => void
}

class ChatHubClient {
  private conn: signalR.HubConnection | null = null
  private starting: Promise<void> | null = null
  private handlers: Handlers = {}

  setHandlers(h: Handlers) {
    this.handlers = h
  }

  private getAccessToken(): string {
    return (
      sessionStorage.getItem("accessToken") ||
      sessionStorage.getItem("access_token") ||
      ""
    )
  }

  private buildConnection() {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("/api/hubs/chat", {
        accessTokenFactory: async () => this.getAccessToken(),
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .build()

    connection.on("presence.changed", (p: PresencePayload) => {
      this.handlers.onPresenceChanged?.(p)
    })

    connection.on("message.new", (m: ChatMessage | any) => {
      this.handlers.onMessageNew?.(m)
    })

    connection.on("chat.message.updated", (p: MessageUpdatedPayload) => {
      this.handlers.onMessageUpdated?.(p)
    })

    connection.on("chat.message.deleted", (p: MessageDeletedPayload) => {
      this.handlers.onMessageDeleted?.(p)
    })

    connection.onreconnecting((err) => {
      console.warn("ChatHub reconnecting...", err)
    })

    connection.onreconnected((connectionId) => {
      console.log("ChatHub reconnected:", connectionId)
    })

    connection.onclose((err) => {
      console.warn("ChatHub closed", err)
    })

    return connection
  }

  async start() {
    if (!this.conn) {
      this.conn = this.buildConnection()
    }

    const st = this.conn.state

    if (st === signalR.HubConnectionState.Connected) return

    if (
      st === signalR.HubConnectionState.Connecting ||
      st === signalR.HubConnectionState.Reconnecting
    ) {
      if (this.starting) return this.starting
      return
    }

    if (this.starting) return this.starting

    this.starting = this.conn.start().finally(() => {
      this.starting = null
    })

    return this.starting
  }

  async stop() {
    if (!this.conn) return

    const current = this.conn
    this.conn = null
    this.starting = null

    try {
      await current.stop()
    } catch (e) {
      console.error("ChatHub stop failed", e)
    }
  }

  async restart() {
    await this.stop()
    await this.start()
  }

  private async ensureStarted() {
    await this.start()

    if (!this.conn) {
      throw new Error("chat_hub_not_initialized")
    }

    if (this.conn.state !== signalR.HubConnectionState.Connected) {
      throw new Error("chat_hub_not_connected")
    }
  }

  async joinChat(chatId: number) {
    await this.ensureStarted()
    await this.conn!.invoke("JoinChat", chatId)
  }

  async leaveChat(chatId: number) {
    if (!this.conn) return
    if (this.conn.state !== signalR.HubConnectionState.Connected) return
    await this.conn.invoke("LeaveChat", chatId)
  }

  async sendMessage(chatId: number, text: string) {
    await this.ensureStarted()
    await this.conn!.invoke("SendMessage", chatId, text)
  }
}

export const chatHubClient = new ChatHubClient()
