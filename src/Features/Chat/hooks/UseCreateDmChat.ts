import { useState } from "react"
import { ChatService } from "@/shared/api/services/ChatService"
import { useAppStore, chatSelectors } from "@/shared/store/appStore"
import type { ChatThreadListItemDto } from "@/shared/types/chat/ChatDtos"

const extractChatId = (data: any): number | null => {
  const id = data?.chatId ?? data?.id ?? data?.threadId ?? null
  return typeof id === "number" ? id : null
}

const useCreateDmChat = () => {
  const actions = useAppStore(chatSelectors.chatActions)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createDm = async (otherUserId: number) => {
    setLoading(true)
    setError(null)

    try {
      const res = await ChatService.createDm(otherUserId)
      const chatId = extractChatId((res as any)?.data)
      if (!chatId) {
        setError("Nie udało się odczytać chatId z odpowiedzi.")
        return
      }

      try {
        const t = await ChatService.getThreads({
          page: 1,
          pageSize: 20,
          search: null,
        })
        const items = (t as any)?.data as ChatThreadListItemDto[] | undefined
        actions.setThreads(items ?? [])
      } catch {
        // best-effort
      }

      actions.openWindow(chatId)
      actions.closePopover()
    } catch {
      setError("Nie udało się utworzyć rozmowy.")
    } finally {
      setLoading(false)
    }
  }

  return { createDm, loading, error, clearError: () => setError(null) }
}

export default useCreateDmChat
