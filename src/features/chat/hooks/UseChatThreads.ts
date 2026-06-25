import { useEffect, useState } from "react"
import { ChatService } from "@/shared/api/services/ChatService"
import {
  useAppStore,
  chatSelectors,
  selectCounter,
} from "@/shared/store/appStore"
import type { ChatThreadListItemDto } from "@/shared/types/chat/ChatDtos"
import { extractErrorMessage } from "@/shared/utilities/errorHandlers"

type Params = {
  enabled?: boolean
  initialPage?: number
  pageSize?: number
  search?: string | null
}

const DEFAULT_PAGE_SIZE = 15

const useChatThreads = ({
  enabled = true,
  initialPage = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  search = null,
}: Params) => {
  const actions = useAppStore(chatSelectors.chatActions)
  const setChatThreadIds = useAppStore(
    (s) => s.setChatThreadIds as ((ids: number[]) => void) | undefined
  )

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(initialPage)
  const [hasMore, setHasMore] = useState(true)

  const refreshKey = useAppStore(selectCounter("chat:threads"))

  const reqSeq = { current: 0 }

  const fetchPage = async (p: number, append = false) => {
    const seq = ++reqSeq.current
    setLoading(true)
    setError(null)

    try {
      const res = await ChatService.getThreads({ page: p, pageSize, search })
      if (seq !== reqSeq.current) return

      const items = res.data ?? []

      if (append) {
        const prev = useAppStore.getState().chat.threads ?? []
        const existingIds = new Set(
          prev.map((t) => Number(t.chatConversationId))
        )
        const unique = items.filter(
          (t: ChatThreadListItemDto) =>
            !existingIds.has(Number(t.chatConversationId))
        )
        actions.setThreads([...prev, ...unique])
      } else {
        actions.setThreads(items)
      }

      const ids = useAppStore
        .getState()
        .chat.threads.map((t: ChatThreadListItemDto) =>
          Number(t.chatConversationId)
        )
        .filter((x: number) => Number.isFinite(x) && x > 0)

      setChatThreadIds?.(ids)

      setHasMore(items.length === pageSize)
    } catch (e) {
      setError(extractErrorMessage(e, "threads_load_failed"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!enabled) return

    let cancelled = false

    ;(async () => {
      try {
        setPage(initialPage)
        await fetchPage(initialPage, false)
      } catch (e) {
        if (!cancelled) setError(extractErrorMessage(e, "threads_load_failed"))
      }
    })()

    return () => {
      cancelled = true
    }
  }, [enabled, search, refreshKey])

  const loadMore = async () => {
    if (loading || !hasMore || !enabled) return
    const next = page + 1
    setPage(next)
    await fetchPage(next, true)
  }

  const refresh = async () => {
    setPage(initialPage)
    await fetchPage(initialPage, false)
  }

  return { loading, error, loadMore, hasMore, refresh }
}

export default useChatThreads
