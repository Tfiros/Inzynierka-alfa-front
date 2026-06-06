import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react"
import { ChatService } from "@/shared/api/services/ChatService"
import { useAppStore, chatSelectors } from "@/shared/store/appStore"
import type { ChatMessage } from "@/shared/types/chat/ChatDtos"

const TOP_THRESHOLD_PX = 60
const PAGE_SIZE = 50

export function useInfiniteChatMessages(
  chatId: number,
  messages: ChatMessage[]
) {
  const actions = useAppStore(chatSelectors.chatActions)

  const listRef = useRef<HTMLDivElement | null>(null)

  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const restoreScrollRef = useRef<null | {
    prevHeight: number
    prevTop: number
    forChatId: number
  }>(null)

  const oldestMessageId = useMemo(() => {
    if (!messages.length) return null
    return messages[0].id
  }, [messages])

  const loadMore = useCallback(async () => {
    if (loadingMore) return
    if (!hasMore) return
    if (!oldestMessageId) return

    const el = listRef.current
    if (!el) return

    setLoadingMore(true)
    try {
      restoreScrollRef.current = {
        prevHeight: el.scrollHeight,
        prevTop: el.scrollTop,
        forChatId: chatId,
      }

      const res = await ChatService.getMessages({
        chatId,
        beforeMessageId: oldestMessageId,
        pageSize: PAGE_SIZE,
      })

      const older = res.data ?? []

      if (older.length < PAGE_SIZE) setHasMore(false)
      if (older.length) actions.prependMessages(chatId, older)
      else setHasMore(false)
    } finally {
      setLoadingMore(false)
    }
  }, [loadingMore, hasMore, oldestMessageId, chatId, actions])

  const onScroll = useCallback(() => {
    const el = listRef.current
    if (!el) return
    if (el.scrollTop <= TOP_THRESHOLD_PX) loadMore()
  }, [loadMore])

  useLayoutEffect(() => {
    const r = restoreScrollRef.current
    const el = listRef.current
    if (!r || !el) return
    if (r.forChatId !== chatId) return

    const newHeight = el.scrollHeight
    el.scrollTop = newHeight - r.prevHeight + r.prevTop
    restoreScrollRef.current = null
  }, [messages.length, chatId])

  const didPrependRef = useRef(false)
  useLayoutEffect(() => {
    didPrependRef.current = restoreScrollRef.current !== null
  }, [messages.length])

  return {
    listRef,
    onScroll,
    loadingMore,
    hasMore,
    loadMore,
    didPrependRef,
  }
}
