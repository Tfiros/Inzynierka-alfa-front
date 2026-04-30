import { useCallback, useRef, useState } from "react"
import { NotificationsService } from "@/shared/api/services/NotificationsService"
import { useAppStore } from "@/shared/store/appStore"

const PAGE_SIZE = 10

export const useNotificationsDropdown = () => {
  const notifications = useAppStore((s) => s.notifications)
  const setNotifications = useAppStore((s) => s.setNotifications)
  const appendNotifications = useAppStore((s) => s.appendNotifications)
  const markReadLocal = useAppStore((s) => s.markNotificationAsReadLocal)
  const markAllReadLocal = useAppStore((s) => s.markAllNotificationsAsReadLocal)
  const removeLocal = useAppStore((s) => s.removeNotificationLocal)

  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const cursorCreatedAtRef = useRef<string | null>(null)
  const cursorIdRef = useRef<number | null>(null)
  const initializedRef = useRef(false)

  const loadInitial = useCallback(async () => {
    if (isLoading) return

    setIsLoading(true)

    try {
      const res = await NotificationsService.getNotifications({
        take: PAGE_SIZE,
      })

      if (!res.isSuccess || !res.data) return

      setNotifications(res.data.items)
      setHasMore(res.data.hasMore)
      cursorCreatedAtRef.current = res.data.nextCursorCreatedAt ?? null
      cursorIdRef.current = res.data.nextCursorId ?? null
      initializedRef.current = true
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, setNotifications])

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)

    try {
      const res = await NotificationsService.getNotifications({
        take: PAGE_SIZE,
        cursorCreatedAt: cursorCreatedAtRef.current,
        cursorId: cursorIdRef.current,
      })

      if (!res.isSuccess || !res.data) return

      appendNotifications(res.data.items)
      setHasMore(res.data.hasMore)
      cursorCreatedAtRef.current = res.data.nextCursorCreatedAt ?? null
      cursorIdRef.current = res.data.nextCursorId ?? null
    } finally {
      setIsLoading(false)
    }
  }, [appendNotifications, hasMore, isLoading])

  const ensureLoaded = useCallback(async () => {
    if (initializedRef.current) return
    await loadInitial()
  }, [loadInitial])

  const markAsRead = useCallback(
    async (id: number) => {
      markReadLocal(id)

      try {
        await NotificationsService.markRead(id)
      } catch (e) {
        console.error("mark notification read failed", e)
      }
    },
    [markReadLocal]
  )

  const markAllAsRead = useCallback(async () => {
    markAllReadLocal()

    try {
      await NotificationsService.markReadAll()
    } catch (e) {
      console.error("mark all notifications read failed", e)
    }
  }, [markAllReadLocal])

  const deleteNotification = useCallback(
    async (id: number) => {
      removeLocal(id)

      try {
        await NotificationsService.delete(id)
      } catch (e) {
        console.error("delete notification failed", e)
      }
    },
    [removeLocal]
  )

  return {
    notifications,
    isLoading,
    hasMore,
    ensureLoaded,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  }
}
