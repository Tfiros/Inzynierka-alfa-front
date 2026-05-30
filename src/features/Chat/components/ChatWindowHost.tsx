import ChatWindow from "./ChatWindow"
import { chatSelectors, useAppStore } from "@/shared/store/appStore"

const ChatWindowHost = () => {
  const activeChatId = useAppStore(chatSelectors.activeChatId)
  const title = useAppStore(chatSelectors.activeChatTitle)
  const tradeId = useAppStore(chatSelectors.activeChatTradeId)
  const closedAt = useAppStore(chatSelectors.activeChatClosedAt)
  const isWindowOpen = useAppStore(chatSelectors.isWindowOpen)

  if (!isWindowOpen || !activeChatId) return null

  return (
    <ChatWindow
      key={activeChatId}
      chatId={activeChatId}
      title={title}
      tradeId={tradeId}
      closedAt={closedAt}
    />
  )
}

export default ChatWindowHost
