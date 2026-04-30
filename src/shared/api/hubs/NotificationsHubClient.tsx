import * as signalR from "@microsoft/signalr"
import { useAppStore } from "@/shared/store/AppStore"
import type { NotificationDto } from "@/shared/types/notificationsTypes/notificationsDtos"

export class NotificationsHubClient {
  private static connection: signalR.HubConnection | null = null
  private static starting: Promise<void> | null = null
  private static stopping: Promise<void> | null = null

  private static buildConnection() {
    const conn = new signalR.HubConnectionBuilder()
      .withUrl("/api/hubs/notifications", {
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build()

    conn.on("notificationCreated", (payload: any) => {
      const notification: NotificationDto = {
        id: payload.id,
        title: payload.title,
        message: payload.message,
        createdAt: payload.createdAt,
        readAt: null,
        isRead: false,
      }

      useAppStore.getState().pushNotification(notification)

      window.dispatchEvent(
        new CustomEvent("notification:created", {
          detail: notification,
        })
      )
    })

    conn.onclose((err) => {
      if (err) {
        console.warn("[NotificationsHub] connection closed", err)
      }
    })

    return conn
  }

  public static async start(): Promise<void> {
    if (this.stopping) {
      await this.stopping.catch(() => {})
    }

    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      return
    }

    if (this.connection?.state === signalR.HubConnectionState.Connecting) {
      return this.starting ?? Promise.resolve()
    }

    if (this.connection?.state === signalR.HubConnectionState.Reconnecting) {
      return
    }

    if (this.starting) {
      return this.starting
    }

    if (!this.connection) {
      this.connection = this.buildConnection()
    }

    const conn = this.connection

    this.starting = conn
      .start()
      .catch((e) => {
        if (this.connection === conn) {
          this.connection = null
        }

        throw e
      })
      .finally(() => {
        this.starting = null
      })

    return this.starting
  }

  public static async stop(): Promise<void> {
    if (this.starting) {
      await this.starting.catch(() => {})
    }

    if (!this.connection) return

    const conn = this.connection
    this.connection = null

    if (
      conn.state === signalR.HubConnectionState.Disconnected ||
      conn.state === signalR.HubConnectionState.Disconnecting
    ) {
      return
    }

    this.stopping = conn
      .stop()
      .catch((e) => {
        console.error("[NotificationsHub] stop failed", e)
      })
      .finally(() => {
        this.stopping = null
      })

    await this.stopping
  }
}
