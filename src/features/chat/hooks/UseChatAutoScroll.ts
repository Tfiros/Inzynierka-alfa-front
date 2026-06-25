import { useEffect, useRef } from "react"

export function useChatAutoScroll(args: {
  chatId: number
  messagesLength: number
  listRef: React.RefObject<HTMLDivElement | null>
  bottomRef: React.RefObject<HTMLDivElement | null>
  didPrependRef?: React.MutableRefObject<boolean>
}) {
  const { chatId, messagesLength, listRef, bottomRef, didPrependRef } = args

  const wasAtBottomRef = useRef(true)

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    const atBottom = el.scrollHeight - (el.scrollTop + el.clientHeight) < 80
    wasAtBottomRef.current = atBottom
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" })
  }, [chatId, bottomRef])

  useEffect(() => {
    if (didPrependRef?.current) return
    if (!wasAtBottomRef.current) return
    bottomRef.current?.scrollIntoView({ behavior: "auto" })
  }, [messagesLength, bottomRef, didPrependRef])
}
