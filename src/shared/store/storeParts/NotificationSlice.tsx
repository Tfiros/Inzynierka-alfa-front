import type { NotificationDto } from "@/shared/types/notificationsTypes/notificationsDtos"

export type NotificationsSlice = {
  unreadNotificationsCount: number
  notifications: NotificationDto[]

  setNotifications: (items: NotificationDto[]) => void
  appendNotifications: (items: NotificationDto[]) => void
  pushNotification: (n: NotificationDto) => void

  markNotificationAsReadLocal: (id: number) => void
  markAllNotificationsAsReadLocal: () => void
  removeNotificationLocal: (id: number) => void

  resetUnreadNotifications: () => void
  setUnreadNotificationsCount: (count: number) => void
}

const mergeUnique = (
  existing: NotificationDto[],
  incoming: NotificationDto[]
): NotificationDto[] => {
  const map = new Map<number, NotificationDto>()

  for (const n of existing) map.set(n.id, n)
  for (const n of incoming) map.set(n.id, n)

  return Array.from(map.values()).sort((a, b) => {
    const dateDiff =
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()

    if (dateDiff !== 0) return dateDiff

    return b.id - a.id
  })
}

export const createNotificationsSlice = (
  set: (fn: (state: any) => any) => void
): NotificationsSlice => ({
  unreadNotificationsCount: 0,
  notifications: [],

  setNotifications: (items) =>
    set(() => ({
      notifications: items,
      unreadNotificationsCount: items.filter((x) => !x.isRead).length,
    })),

  appendNotifications: (items) =>
    set((s: any) => {
      const merged = mergeUnique(s.notifications ?? [], items)

      return {
        notifications: merged,
        unreadNotificationsCount: merged.filter((x) => !x.isRead).length,
      }
    }),

  pushNotification: (n) =>
    set((s: any) => {
      const exists = (s.notifications ?? []).some(
        (x: NotificationDto) => x.id === n.id
      )

      if (exists) {
        return {}
      }

      return {
        notifications: [n, ...(s.notifications ?? [])],
        unreadNotificationsCount: (s.unreadNotificationsCount ?? 0) + 1,
      }
    }),

  markNotificationAsReadLocal: (id) =>
    set((s: any) => {
      const notifications = (s.notifications ?? []).map((n: NotificationDto) =>
        n.id === id
          ? {
              ...n,
              isRead: true,
              readAt: n.readAt ?? new Date().toISOString(),
            }
          : n
      )

      return {
        notifications,
        unreadNotificationsCount: notifications.filter(
          (x: NotificationDto) => !x.isRead
        ).length,
      }
    }),

  markAllNotificationsAsReadLocal: () =>
    set((s: any) => {
      const now = new Date().toISOString()

      return {
        notifications: (s.notifications ?? []).map((n: NotificationDto) => ({
          ...n,
          isRead: true,
          readAt: n.readAt ?? now,
        })),
        unreadNotificationsCount: 0,
      }
    }),

  removeNotificationLocal: (id) =>
    set((s: any) => {
      const notifications = (s.notifications ?? []).filter(
        (n: NotificationDto) => n.id !== id
      )

      return {
        notifications,
        unreadNotificationsCount: notifications.filter(
          (x: NotificationDto) => !x.isRead
        ).length,
      }
    }),

  resetUnreadNotifications: () =>
    set(() => ({
      unreadNotificationsCount: 0,
    })),

  setUnreadNotificationsCount: (count) =>
    set(() => ({
      unreadNotificationsCount: Math.max(0, count),
    })),
})
