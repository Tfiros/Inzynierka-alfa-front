import { useCallback } from "react"
import { ChatService } from "@/shared/api/services/ChatService"
import { useAppStore, chatSelectors } from "@/shared/store/appStore"

const useOpenThread = () => {
  const actions = useAppStore(chatSelectors.chatActions)

  return useCallback(
    async (
      chatId: number,
      tradeId: number,
      closedAtUtc?: string | null,
      title?: string | null
    ) => {
      if (!Number.isFinite(chatId) || chatId <= 0) return

      actions.openWindow(chatId, tradeId, closedAtUtc ?? null, title ?? null)
      actions.resetUnread(chatId)

      const res = await ChatService.getMessages({
        chatId,
        beforeMessageId: null,
        pageSize: 50,
      })

      const items = res.data ?? []
      actions.setMessages(chatId, items)

      const lastId = items.length ? items[items.length - 1].id : null
      if (!lastId) return

      try {
        const rr = await ChatService.markRead(chatId, {
          lastReadMessageId: lastId,
        })
        const unread = rr.data?.unreadCount ?? 0
        actions.applyReadState(chatId, unread)
      } catch {
        // ignore
      }
    },
    [actions]
  )
}

export default useOpenThread
