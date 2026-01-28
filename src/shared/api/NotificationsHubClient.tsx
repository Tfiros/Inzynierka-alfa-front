import * as signalR from "@microsoft/signalr"
import { HttpTransportType } from "@microsoft/signalr"
import { useAppStore } from "@/shared/store/AppStore"

export type NotificationDto = {
  id: number
  title: string
  message: string
  createdAt: string
  readAt?: string | null
}

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
          transport: HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build()

      conn.on("notificationCreated", (n: NotificationDto) => {
        console.log("[SignalR] notificationCreated", n)
        useAppStore.getState().pushNotification(n)
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
