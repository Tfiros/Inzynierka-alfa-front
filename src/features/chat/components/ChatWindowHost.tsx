import ChatWindow from "./ChatWindow"
import { chatSelectors, useAppStore } from "@/shared/store/appStore"

const ChatWindowHost = () => {
  const activeChatId = useAppStore(chatSelectors.activeChatId)
  const title = useAppStore(chatSelectors.activeChatTitle)
  const tradeId = useAppStore(chatSelectors.activeChatTradeId)
  const closedAt = useAppStore(chatSelectors.activeChatClosedAt)
  const isWindowOpen = useAppStore(chatSelectors.isWindowOpen)
  const otherAuth0UserId = useAppStore(chatSelectors.activeChatOtherAuth0UserId)
  const otherIsOnline = useAppStore(chatSelectors.activeChatOtherIsOnline)

  if (!isWindowOpen || !activeChatId) return null

  return (
    <ChatWindow
      key={activeChatId}
      chatId={activeChatId}
      title={title}
      tradeId={tradeId}
      closedAt={closedAt}
      otherAuth0UserId={otherAuth0UserId}
      otherIsOnline={otherIsOnline}
    />
  )
}

export default ChatWindowHost
