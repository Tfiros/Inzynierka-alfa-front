import * as signalR from "@microsoft/signalr"
import { useAppStore } from "@/shared/store/AppStore"
import type { NotificationDto } from "@/shared/types/notificationsTypes/notificationsDtos"

export class NotificationsHubClient {
  private static connection: signalR.HubConnection | null = null
  private static starting: Promise<void> | null = null
  private static stopRequested = false

  public static start(): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      return Promise.resolve()
    }

    if (this.starting) return this.starting

    this.stopRequested = false

    this.starting = (async () => {
      if (this.connection) {
        try {
          await this.connection.stop()
        } catch {}
        this.connection = null
      }

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

      this.connection = conn

      try {
        await conn.start()
      } catch (e) {
        this.connection = null
        throw e
      } finally {
        this.starting = null
      }

      if (this.stopRequested) {
        await this.stop()
      }
    })()

    return this.starting
  }

  public static async stop(): Promise<void> {
    if (this.starting) {
      this.stopRequested = true
      try {
        await this.starting
      } catch {}
      return
    }

    if (!this.connection) return

    const c = this.connection
    this.connection = null

    try {
      await c.stop()
    } catch (e) {
      console.error("Error stopping NotificationsHubClient", e)
    }
  }
}
