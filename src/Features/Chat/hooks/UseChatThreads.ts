import { useEffect, useState } from "react"
import { ChatService } from "@/shared/api/services/ChatService"
import { useAppStore, chatSelectors } from "@/shared/store/appStore"
import type { ChatThreadListItemDto } from "@/shared/types/chat/ChatDtos"

type Params = {
  enabled?: boolean
  page?: number
  pageSize?: number
  search?: string | null
}

const useChatThreads = ({
  enabled = true,
  page = 1,
  pageSize = 50,
  search = null,
}: Params) => {
  const actions = useAppStore(chatSelectors.chatActions)
  const setChatThreadIds = useAppStore(
    (s: any) => s.setChatThreadIds as ((ids: number[]) => void) | undefined
  )

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) return

    let cancelled = false

    ;(async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await ChatService.getThreads({ page, pageSize, search })
        if (cancelled) return

        const items = res.data ?? []
        actions.setThreads(items)

        const ids = items
          .map((t: ChatThreadListItemDto) => Number(t.chatId))
          .filter((x: number) => Number.isFinite(x) && x > 0)

        setChatThreadIds?.(ids)
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "threads_load_failed")
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [enabled, page, pageSize, search, actions, setChatThreadIds])

  return { loading, error }
}

export default useChatThreads
