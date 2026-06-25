import { useEffect } from "react"
import {
  chatHubClient,
  type ChatClosedPayload,
  type ChatCreatedPayload,
  type MessageDeletedPayload,
  type MessageUpdatedPayload,
} from "@/shared/api/hubs/ChatHub"
import { useAppStore, chatSelectors } from "@/shared/store/appStore"
import type { ChatMessage } from "@/shared/types/chat/ChatDtos"

const useChatHub = (enabled = true) => {
  const actions = useAppStore(chatSelectors.chatActions)

  useEffect(() => {
    if (!enabled) return

    chatHubClient.setHandlers({
      onPresenceChanged: ({ auth0UserId, isOnline }) => {
        actions.setUserOnline(auth0UserId, isOnline)
      },

      onMessageNew: (msg: ChatMessage) => {
        const chatId = Number(msg.chatConversationId)
        if (!Number.isFinite(chatId) || chatId <= 0) return

        actions.appendMessage(chatId, msg)

        const st = useAppStore.getState()
        const isActive = st.chat.isWindowOpen && st.chat.activeChatId === chatId

        if (!isActive) {
          st.markChatUnreadLocal(chatId)
        }
      },

      onMessageUpdated: (p: MessageUpdatedPayload) => {
        actions.updateMessage(p.chatConversationId, p.id, {
          message: p.message,
          editedAt: p.editedAtUtc ?? new Date().toISOString(),
        })
      },

      onMessageDeleted: (p: MessageDeletedPayload) => {
        actions.markDeletedById(p.messageId)
      },

      onChatClosed: (p: ChatClosedPayload) => {
        actions.markThreadClosed(p.chatConversationId, p.closedAtUtc)
      },

      onChatCreated: (p: ChatCreatedPayload) => {
        const chatId = Number(p.chatConversationId)
        if (!Number.isFinite(chatId) || chatId <= 0) return

        chatHubClient.joinChat(chatId).catch(console.error)
        useAppStore.getState().inc("chat:threads")
      },
    })

    chatHubClient.start().catch(console.error)
  }, [actions, enabled])
}

export default useChatHub
