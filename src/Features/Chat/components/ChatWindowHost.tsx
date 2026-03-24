import ChatWindow from "./ChatWindow"
import { chatSelectors, useAppStore } from "@/shared/store/appStore"

const ChatWindowHost = () => {
  const activeChatId = useAppStore(chatSelectors.activeChatId)
  const activeChatTitle = useAppStore(chatSelectors.activeChatTitle)
  const isWindowOpen = useAppStore(chatSelectors.isWindowOpen)

  if (!isWindowOpen || !activeChatId) return null

  return (
    <ChatWindow
      chatId={activeChatId}
      title={activeChatTitle ?? `Chat #${activeChatId}`}
    />
  )
}

export default ChatWindowHost
