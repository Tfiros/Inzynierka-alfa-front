import { useEffect } from "react"
import { chatHubClient } from "@/shared/api/hubs/ChatHub"

const useChatMembership = (chatId: number | null, enabled: boolean) => {
  useEffect(() => {
    if (!enabled || !chatId) return

    let cancelled = false

    ;(async () => {
      try {
        await chatHubClient.joinChat(chatId)
      } catch (e) {
        if (!cancelled) console.error("joinChat failed", e)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [chatId, enabled])
}

export default useChatMembership
