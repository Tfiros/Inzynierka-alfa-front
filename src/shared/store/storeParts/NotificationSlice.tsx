import type { NotificationDto } from "@/shared/types/notificationsTypes/notificationsDtos"
import type { StateCreator } from "zustand"
import type { AuthSlice } from "./authSlice"

export type NotificationsSlice = {
  notifications: NotificationDto[]

  setNotifications: (items: NotificationDto[]) => void
  appendNotifications: (items: NotificationDto[]) => void
  pushNotification: (n: NotificationDto) => void

  markNotificationAsReadLocal: (id: number) => void
  markAllNotificationsAsReadLocal: () => void
  removeNotificationLocal: (id: number) => void

  setNavbarNotificationsUnreadTotal: (count: number) => void
}

type StoreState = NotificationsSlice &
  Pick<AuthSlice, "navbarUser"> &
  Record<string, unknown>

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

const setNavbarUnreadCount = (
  state: Pick<AuthSlice, "navbarUser">,
  count: number
) =>
  state.navbarUser
    ? {
        ...state.navbarUser,
        notificationsUnreadTotal: Math.max(0, count),
      }
    : null

export const createNotificationsSlice: StateCreator<
  StoreState,
  [],
  [],
  NotificationsSlice
> = (set) => ({
  notifications: [],

  setNotifications: (items) =>
    set(() => ({
      notifications: items,
    })),

  appendNotifications: (items) =>
    set((s) => {
      const merged = mergeUnique(s.notifications ?? [], items)

      return {
        notifications: merged,
      }
    }),

  pushNotification: (n) =>
    set((s) => {
      const exists = (s.notifications ?? []).some(
        (x: NotificationDto) => x.id === n.id
      )

      if (exists) return {}

      const currentUnread = s.navbarUser?.notificationsUnreadTotal ?? 0

      return {
        notifications: [n, ...(s.notifications ?? [])],
        navbarUser: n.isRead
          ? s.navbarUser
          : setNavbarUnreadCount(s, currentUnread + 1),
      }
    }),

  markNotificationAsReadLocal: (id) =>
    set((s) => {
      const wasUnread = (s.notifications ?? []).some(
        (n: NotificationDto) => n.id === id && !n.isRead
      )

      const notifications = (s.notifications ?? []).map((n: NotificationDto) =>
        n.id === id
          ? {
              ...n,
              isRead: true,
              readAt: n.readAt ?? new Date().toISOString(),
            }
          : n
      )

      const currentUnread = s.navbarUser?.notificationsUnreadTotal ?? 0

      return {
        notifications,
        navbarUser: wasUnread
          ? setNavbarUnreadCount(s, currentUnread - 1)
          : s.navbarUser,
      }
    }),

  markAllNotificationsAsReadLocal: () =>
    set((s) => {
      const now = new Date().toISOString()

      return {
        notifications: (s.notifications ?? []).map((n: NotificationDto) => ({
          ...n,
          isRead: true,
          readAt: n.readAt ?? now,
        })),
        navbarUser: setNavbarUnreadCount(s, 0),
      }
    }),

  removeNotificationLocal: (id) =>
    set((s) => {
      const removed = (s.notifications ?? []).find(
        (n: NotificationDto) => n.id === id
      )

      const notifications = (s.notifications ?? []).filter(
        (n: NotificationDto) => n.id !== id
      )

      const currentUnread = s.navbarUser?.notificationsUnreadTotal ?? 0

      return {
        notifications,
        navbarUser:
          removed && !removed.isRead
            ? setNavbarUnreadCount(s, currentUnread - 1)
            : s.navbarUser,
      }
    }),

  setNavbarNotificationsUnreadTotal: (count) =>
    set((s) => ({
      navbarUser: setNavbarUnreadCount(s, count),
    })),
})
