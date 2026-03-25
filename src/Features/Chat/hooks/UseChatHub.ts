import { useEffect } from "react"
import { chatHubClient } from "@/shared/api/hubs/ChatHub"
import { useAppStore, chatSelectors } from "@/shared/store/appStore"
import type { ChatMessage } from "@/shared/types/chat/ChatDtos"

type UpdatedPayload = {
  id: number
  chatConversationId: number
  message: string
  editedAtUtc?: string | null
}

type DeletedPayload = { messageId: number }

const useChatHub = (enabled = true) => {
  const actions = useAppStore(chatSelectors.chatActions)

  useEffect(() => {
    if (!enabled) return

    chatHubClient.setHandlers({
      onPresenceChanged: ({ auth0UserId, isOnline }) => {
        actions.setUserOnline(auth0UserId, isOnline)
      },

      onMessageNew: (msg: any) => {
        const chatId = Number(msg.chatConversationId ?? msg.chatId)
        if (!Number.isFinite(chatId) || chatId <= 0) return

        actions.appendMessage(chatId, msg as ChatMessage)

        const st = useAppStore.getState()
        const isActive = st.chat.isWindowOpen && st.chat.activeChatId === chatId

        if (!isActive) {
          st.markChatUnreadLocal(chatId)
        }
      },

      onMessageUpdated: (p: UpdatedPayload) => {
        actions.updateMessage(p.chatConversationId, p.id, {
          message: p.message,
          editedAt: p.editedAtUtc ?? new Date().toISOString(),
        })
      },

      onMessageDeleted: (p: DeletedPayload) => {
        actions.markDeletedById(p.messageId)
      },
    })

    chatHubClient.start().catch(console.error)
  }, [actions, enabled])
}

export default useChatHub
