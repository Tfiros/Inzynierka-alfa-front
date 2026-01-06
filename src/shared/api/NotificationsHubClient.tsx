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
    // jeśli już jesteśmy połączeni -> ok
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      return Promise.resolve()
    }

    // jeśli start już trwa -> podepnij się
    if (this.starting) return this.starting

    this.stopRequested = false

    this.starting = (async () => {
      // jeżeli został "trup" po wcześniejszym starcie
      if (this.connection) {
        try {
          await this.connection.stop()
        } catch {}
        this.connection = null
      }

      const conn = new signalR.HubConnectionBuilder()
        .withUrl("/api/hubs/notifications", {
          withCredentials: true,
          // zostawiam WebSockets (bo już debugowałeś), ale możesz to wyrzucić
          transport: HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build()

      conn.on("notificationCreated", (n: NotificationDto) => {
        console.log("[SignalR] notificationCreated", n)
        useAppStore.getState().pushNotification(n)
      })

      conn.onclose((e) => console.log("[SignalR] closed", e))
      conn.onreconnected((id) => console.log("[SignalR] reconnected", id))

      this.connection = conn

      try {
        await conn.start()
        console.log("[SignalR] started", conn.connectionId)
      } catch (e) {
        console.log("[SignalR] start failed", e)
        // mega ważne po F5: wyczyść, żeby kolejne start() mogły spróbować ponownie
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
    // stop wywołany w trakcie startu -> odłóż do końca
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
      console.log("[SignalR] stop error", e)
    }
  }
}
