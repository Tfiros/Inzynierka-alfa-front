import { memo, useEffect, useRef, useState } from "react"
import { Button } from "@/shared/components/button"
import { Input } from "@/shared/components/input"
import { X } from "lucide-react"

import { chatHubClient } from "@/shared/api/hubs/ChatHub"
import { useAppStore, chatSelectors } from "@/shared/store/appStore"

import type { ChatMessage } from "@/shared/types/chat/ChatDtos"

import { useInfiniteChatMessages } from "../hooks/UseInfiniteChatMessages"
import { useChatAutoScroll } from "../hooks/UseChatAutoScroll"
import { useChatMessageActions } from "../hooks/UseChatMessagesActions"
import useChatMembership from "../hooks/UseChatMembership"
import { Link } from "react-router-dom"
import { isMessageEditExpired } from "@/shared/utilities/Chat/isMessageEditExpired"
import ChatMessageItem from "./ChatMessageItem"
type Props = {
  chatId: number
  title: string | null
  tradeId: number | null
  closedAt: string | null
  otherAuth0UserId: string | null
  otherIsOnline: boolean | null
}
const EMPTY_MESSAGES: ChatMessage[] = []

const ChatWindow = ({
  chatId,
  title,
  tradeId,
  closedAt,
  otherAuth0UserId,
  otherIsOnline,
}: Props) => {
  const displayTitle =
    title ?? (tradeId ? `Wymiana #${tradeId}` : `Chat #${chatId}`)
  const isClosed = !!closedAt
  const actions = useAppStore(chatSelectors.chatActions)
  const userId = useAppStore((s: any) => s.userId as number | null)
  const liveInMap = useAppStore((s) =>
    otherAuth0UserId ? s.chat.onlineMap[otherAuth0UserId] : null
  )
  const online = otherAuth0UserId ? (liveInMap ?? otherIsOnline ?? false) : null

  useChatMembership(chatId, true)

  const messages: ChatMessage[] = useAppStore(
    (s: any) => s.chat.messagesByChatId?.[chatId] ?? EMPTY_MESSAGES
  )

  const bottomRef = useRef<HTMLDivElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)

  const {
    listRef: infiniteListRef,
    onScroll,
    loadingMore,
    hasMore,
    didPrependRef,
  } = useInfiniteChatMessages(chatId, messages)

  const setListRef = (el: HTMLDivElement | null) => {
    listRef.current = el
    ;(infiniteListRef as any).current = el
  }

  useChatAutoScroll({
    chatId,
    messagesLength: messages.length,
    listRef,
    bottomRef,
    didPrependRef,
  })

  const didInitialScrollRef = useRef(false)
  useEffect(() => {
    didInitialScrollRef.current = false
  }, [chatId])

  useEffect(() => {
    if (didInitialScrollRef.current) return
    if (!messages.length) return
    queueMicrotask(() => {
      bottomRef.current?.scrollIntoView({ block: "end" })
      didInitialScrollRef.current = true
    })
  }, [chatId, messages.length])

  const {
    editingId,
    editText,
    setEditText,
    isBusy,
    canEditOrDelete,
    startEdit,
    cancelEdit,
    saveEdit,
    deleteMessage,
  } = useChatMessageActions({
    chatId,
    userId,
    isClosed,
    messages,
    updateMessage: actions.updateMessage,
    markDeletedById: actions.markDeletedById,
  })

  const [text, setText] = useState("")
  const [sending, setSending] = useState(false)

  const close = () => actions.closeWindow()

  const send = async () => {
    const msg = text.trim()
    if (!msg) return
    if (sending || isClosed) return

    setSending(true)
    try {
      await chatHubClient.sendMessage(chatId, msg)
      setText("")
    } catch (e) {
      console.error("sendMessage failed", e)
    } finally {
      setSending(false)
    }
  }

  const onKeyDownSend = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return
    if (e.shiftKey) return
    e.preventDefault()
    e.stopPropagation()
    send()
  }

  const isDeleted = (m: ChatMessage) =>
    !!m.deletedAt || m.message === "[deleted]"

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[min(420px,calc(100vw-1rem))] overflow-hidden rounded-xl border bg-background shadow-lg">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {online !== null && (
              <span
                title={online ? "Online" : "Offline"}
                className={`h-2 w-2 shrink-0 rounded-full ${online ? "bg-green-500" : "bg-muted-foreground/30"}`}
              ></span>
            )}
            {tradeId ? (
              <Link
                to={`/tradePanel?tradeId=${tradeId}`}
                className="truncate text-sm font-semibold hover:underline"
                title={displayTitle}
              >
                {displayTitle}
              </Link>
            ) : (
              <div className="truncate text-sm font-semibold">
                {displayTitle}
              </div>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {isClosed
              ? "Czat zamknięty (wymiana zakończona)"
              : loadingMore
                ? "Ładowanie starszych..."
                : hasMore
                  ? "Przewiń w górę po starsze"
                  : "To już wszystko"}
          </div>
        </div>

        <Button variant="ghost" size="icon" onClick={close}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div
        ref={setListRef}
        onScroll={onScroll}
        className="h-[320px] overflow-auto px-3 py-3 text-sm"
      >
        <div className="space-y-2">
          {messages.map((m) => {
            const mine = !!userId && m.senderId === userId
            const busy = isBusy(m.id)
            const deleted = isDeleted(m)
            const editExpired = isMessageEditExpired(m.createdAt)

            return (
              <ChatMessageItem
                key={m.id}
                message={m}
                mine={mine}
                busy={busy}
                deleted={deleted}
                editExpired={editExpired}
                displayTitle={displayTitle}
                editingId={editingId}
                editText={editText}
                setEditText={setEditText}
                canEditOrDelete={canEditOrDelete}
                startEdit={startEdit}
                cancelEdit={cancelEdit}
                saveEdit={saveEdit}
                deleteMessage={deleteMessage}
              />
            )
          })}

          {!messages.length && (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Brak wiadomości
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="flex gap-2 border-t p-3">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isClosed ? "Chat zamknięty" : "Napisz..."}
          onKeyDown={onKeyDownSend}
          disabled={isClosed}
        />

        <Button
          onClick={send}
          disabled={sending || isClosed}
          className={sending || isClosed ? "" : "cursor-pointer"}
        >
          {sending ? "..." : "Wyślij"}
        </Button>
      </div>
    </div>
  )
}

export default memo(ChatWindow)
