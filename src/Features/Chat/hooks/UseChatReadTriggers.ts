import { useCallback, useEffect, useMemo, useRef } from "react"
import { ChatService } from "@/shared/api/services/ChatService"
import { useAppStore } from "@/shared/store/appStore"
import type { ChatMessage } from "@/shared/types/chat/ChatDtos"

type Params = {
  chatId: number
  enabled: boolean
  messages: ChatMessage[]
}

const READ_DEBOUNCE_MS = 350

const invokeMarkRead = async (chatId: number, lastReadMessageId: number) => {
  if (!Number.isFinite(chatId) || chatId <= 0) return
  if (!Number.isFinite(lastReadMessageId) || lastReadMessageId <= 0) return

  await ChatService.markRead({
    chatConversationId: chatId,
    lastReadMessageId,
  })
}

export const useChatReadTriggers = ({ chatId, enabled, messages }: Params) => {
  const timerRef = useRef<number | null>(null)
  const inFlightRef = useRef(false)
  const forceRef = useRef(false)

  const lastSentMessageIdRef = useRef<number | null>(null)
  const lastQueuedMessageIdRef = useRef<number | null>(null)

  const latestMessageId = useMemo(() => {
    if (!messages.length) return null
    const last = messages[messages.length - 1]
    const id = Number(last?.id)
    return Number.isFinite(id) && id > 0 ? id : null
  }, [messages])

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const markReadLocal = useCallback(() => {
    const st = useAppStore.getState()
    st.markChatReadLocal?.(chatId)
    st.chat?.actions?.resetUnread?.(chatId)
  }, [chatId])

  const canSendRead = useCallback(() => {
    if (!enabled) return false
    if (!latestMessageId || latestMessageId <= 0) return false

    const st = useAppStore.getState()
    const isActive =
      st.chat?.isWindowOpen === true && st.chat?.activeChatId === chatId

    if (!isActive) return false
    if (document.visibilityState !== "visible") return false

    return true
  }, [chatId, enabled, latestMessageId])

  const flushRead = useCallback(async () => {
    timerRef.current = null

    if (!canSendRead()) return
    if (inFlightRef.current) return

    const targetMessageId = lastQueuedMessageIdRef.current ?? latestMessageId
    if (!targetMessageId || targetMessageId <= 0) return

    const forced = forceRef.current === true
    forceRef.current = false

    if (!forced && lastSentMessageIdRef.current === targetMessageId) return

    inFlightRef.current = true
    markReadLocal()

    try {
      await invokeMarkRead(chatId, targetMessageId)
      lastSentMessageIdRef.current = targetMessageId
    } catch (e) {
      console.error("markRead failed", e)
    } finally {
      inFlightRef.current = false
    }
  }, [canSendRead, chatId, latestMessageId, markReadLocal])

  const scheduleRead = useCallback(
    (force = false) => {
      if (!canSendRead()) return
      if (!latestMessageId || latestMessageId <= 0) return

      lastQueuedMessageIdRef.current = latestMessageId
      forceRef.current = forceRef.current || force

      markReadLocal()
      clearTimer()

      timerRef.current = window.setTimeout(() => {
        void flushRead()
      }, READ_DEBOUNCE_MS)
    },
    [canSendRead, clearTimer, flushRead, latestMessageId, markReadLocal]
  )

  useEffect(() => {
    if (!enabled) return
    if (!latestMessageId || latestMessageId <= 0) return

    scheduleRead(false)
  }, [chatId, enabled, latestMessageId, scheduleRead])

  useEffect(() => {
    if (!enabled) return

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        scheduleRead(true)
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange)
    }
  }, [enabled, scheduleRead])

  useEffect(() => {
    return () => {
      clearTimer()
    }
  }, [clearTimer])

  return {
    scheduleRead,
  }
}
