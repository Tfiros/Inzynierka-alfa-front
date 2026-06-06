import { useCallback, useEffect, useRef, useState } from "react"
import type { MouseEvent } from "react"
import { NotificationsService } from "@/shared/api/services/NotificationsService"
import { useAppStore } from "@/shared/store/appStore"

const PAGE_SIZE = 10

export const useNotificationsDropdown = (open: boolean) => {
  const notifications = useAppStore((s) => s.notifications)
  const setNotifications = useAppStore((s) => s.setNotifications)
  const appendNotifications = useAppStore((s) => s.appendNotifications)
  const markReadLocal = useAppStore((s) => s.markNotificationAsReadLocal)
  const markAllReadLocal = useAppStore((s) => s.markAllNotificationsAsReadLocal)
  const removeLocal = useAppStore((s) => s.removeNotificationLocal)
  const unread = useAppStore((s) => s.navbarUser?.notificationsUnreadTotal ?? 0)

  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const scrollRef = useRef<HTMLDivElement | null>(null)
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

  useEffect(() => {
    if (!open) return

    void ensureLoaded()
  }, [ensureLoaded, open])

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el || isLoading || !hasMore) return

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight

    if (distanceFromBottom < 80) {
      void loadMore()
    }
  }, [hasMore, isLoading, loadMore])

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

  const handleMarkAllAsRead = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()

      void markAllAsRead()
    },
    [markAllAsRead]
  )

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
    scrollRef,

    unread,
    notifications,
    isLoading,
    hasMore,

    handleScroll,
    markAsRead,
    handleMarkAllAsRead,
    deleteNotification,
  }
}
