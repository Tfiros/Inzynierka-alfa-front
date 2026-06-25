import useOpenThread from "@/shared/hooks/UseOpenThread"
import { ChatService } from "@/shared/api/services/ChatService"
import type { ChatThreadListItemDto } from "@/shared/types/chat/ChatDtos"
import { chatThreadTitle } from "@/shared/utilities/Chat/chatThreadTitle"
import { useCallback, useRef, useState } from "react"

type UseTradeChatArgs = {
  tradeId: number
  hasMiddleman: boolean
  isMiddleman: boolean
  buyerUserId: number
  sellerUserId: number
}

const useTradeChats = ({
  tradeId,
  hasMiddleman,
  isMiddleman,
  buyerUserId,
  sellerUserId,
}: UseTradeChatArgs) => {
  const openThread = useOpenThread()
  const reqRef = useRef(false)
  const [isLoadingChats, setIsLoadingChats] = useState(false)

  const openSelectedChat = useCallback(
    async (
      selectChat: (
        chats: ChatThreadListItemDto[]
      ) => ChatThreadListItemDto | null
    ) => {
      if (!hasMiddleman || reqRef.current) return
      if (!Number.isFinite(tradeId) || tradeId <= 0) return

      reqRef.current = true
      setIsLoadingChats(true)

      try {
        const res = await ChatService.getByTrade(tradeId)
        const chats = res.isSuccess && res.data ? res.data : []
        const chat = selectChat(chats)

        if (!chat) {
          return
        }

        await openThread(
          chat.chatConversationId,
          chat.tradeId,
          chat.closedAtUtc,
          chatThreadTitle(chat),

          chat.otherUserAuth0UserId,
          chat.isOnline
        )
      } catch (e) {
        console.error("openTradeChat failed", e)
      } finally {
        reqRef.current = false
        setIsLoadingChats(false)
      }
    },
    [hasMiddleman, openThread, tradeId]
  )

  const openBuyerChat = useCallback(
    () =>
      openSelectedChat(
        (chats) => chats.find((c) => c.otherUserId === buyerUserId) ?? null
      ),
    [openSelectedChat, buyerUserId]
  )

  const openSellerChat = useCallback(
    () =>
      openSelectedChat(
        (chats) => chats.find((c) => c.otherUserId === sellerUserId) ?? null
      ),
    [openSelectedChat, sellerUserId]
  )

  const openMyChat = useCallback(
    () =>
      openSelectedChat((chats) =>
        !isMiddleman && chats.length === 1 ? chats[0] : null
      ),
    [openSelectedChat, isMiddleman]
  )
  return {
    isLoadingChats,
    openBuyerChat,
    openSellerChat,
    openMyChat,
  }
}

export default useTradeChats
