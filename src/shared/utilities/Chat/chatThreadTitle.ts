import type { ChatThreadListItemDto } from "@/shared/types/chat/ChatDtos"

export const chatThreadTitle = (chat: ChatThreadListItemDto) => {
  const role =
    chat.otherUserTradeRole === "Buyer"
      ? "Kupujący"
      : chat.otherUserTradeRole === "Seller"
        ? "Sprzedający"
        : chat.otherUserTradeRole === "Middleman"
          ? "Middleman"
          : null
  const nickname = chat.otherUserNickname?.trim()

  let title = `Wymiana #${chat.tradeId}`
  if (role) {
    title += ` - ${role}`
  }
  if (nickname) {
    title += `(${nickname})`
  }
  return title
}
