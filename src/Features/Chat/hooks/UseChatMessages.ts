import { useEffect } from "react"
import { ChatService } from "@/shared/api/services/ChatService"
import { useAppStore, chatSelectors } from "@/shared/store/appStore"
import type { ChatMessage } from "@/shared/types/chat/ChatDtos"

const useChatMessages = (enabled: boolean, chatId: number | null) => {
  const actions = useAppStore(chatSelectors.chatActions)

  useEffect(() => {
    if (!enabled) return
    if (!chatId) return

    let cancelled = false

    ;(async () => {
      try {
        const res = await ChatService.getMessages({ chatId, pageSize: 50 })
        const items = (res as any)?.data as ChatMessage[] | undefined
        console.log("Loaded messages for chatId", chatId, items)
        if (!cancelled) actions.setMessages(chatId, items ?? [])
      } catch (e) {
        console.error("getMessages failed", e)
        if (!cancelled) actions.setMessages(chatId, [])
      }
    })()

    return () => {
      cancelled = true
    }
  }, [enabled, chatId, actions])
}

export default useChatMessages
