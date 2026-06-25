import { useEffect, useRef } from "react"
import { chatHubClient } from "@/shared/api/hubs/ChatHub"
import { useAppStore } from "@/shared/store/appStore"

export const useChatAutoSubscribe = () => {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  const ids = useAppStore((s) => s.chatThreadIds ?? [])
  const joinedRef = useRef<Set<number>>(new Set())

  useEffect(() => {
    if (!isAuthenticated) {
      joinedRef.current.clear()
      return
    }

    if (!ids.length) return
    ;(async () => {
      await chatHubClient.start()

      for (const rawId of ids) {
        const id = Number(rawId)
        if (!Number.isFinite(id) || id <= 0) continue
        if (joinedRef.current.has(id)) continue

        await chatHubClient.joinChat(id)
        joinedRef.current.add(id)
      }
    })().catch(console.error)
  }, [isAuthenticated, ids])
}
