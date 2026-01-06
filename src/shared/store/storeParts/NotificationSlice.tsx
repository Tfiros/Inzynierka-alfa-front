import { type NotificationDto } from "../../api/NotificationsHubClient"
export type NotificationsSlice = {
  unreadNotificationsCount: number
  notifications: NotificationDto[]
  pushNotification: (n: NotificationDto) => void
  resetUnreadNotifications: () => void
  setUnreadNotificationsCount: (count: number) => void
}

export const createNotificationsSlice = (
  set: (fn: (state: any) => any) => void
): NotificationsSlice => ({
  unreadNotificationsCount: 0,
  notifications: [],

  pushNotification: (n) =>
    set((s: any) => ({
      notifications: [n, ...(s.notifications ?? [])],
      unreadNotificationsCount: (s.unreadNotificationsCount ?? 0) + 1,
    })),

  resetUnreadNotifications: () =>
    set(() => ({
      unreadNotificationsCount: 0,
    })),

  setUnreadNotificationsCount: (count) =>
    set(() => ({
      unreadNotificationsCount: Math.max(0, count),
    })),
})
