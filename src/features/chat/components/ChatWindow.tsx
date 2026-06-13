import React, { useCallback, useRef, useState, memo } from "react"
import { Button } from "@/shared/components/button"
import { Input } from "@/shared/components/input"
import {
  X,
  MoreVertical,
  Pencil,
  Trash2,
  Check,
  X as XIcon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/dropdown-menu"

import { chatHubClient } from "@/shared/api/hubs/ChatHub"
import { useAppStore, chatSelectors } from "@/shared/store/appStore"

import type { ChatMessage } from "@/shared/types/chat/ChatDtos"

import { useInfiniteChatMessages } from "../hooks/UseInfiniteChatMessages"
import { useChatAutoScroll } from "../hooks/UseChatAutoScroll"
import { useChatMessageActions } from "../hooks/UseChatMessagesActions"
import useChatMembership from "../hooks/UseChatMembership"
import useChatMessages from "../hooks/UseChatMessages"
import { Link } from "react-router-dom"
import { isMessageEditExpired } from "@/shared/utilities/Chat/isMessageEditExpired"

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
  otherIsOnline,
}: Props) => {
  const actions = useAppStore(chatSelectors.chatActions)
  const userId = useAppStore((state) => state.userId)
  const messagesByChatId = useAppStore(chatSelectors.messagesByChatId)
  const messages = messagesByChatId[chatId] ?? EMPTY_MESSAGES
  const isClosed = Boolean(closedAt)
  const displayTitle = title ?? "Czat"
  const online = otherIsOnline

  useChatMembership(chatId, true)
  useChatMessages(!!chatId, chatId)

  const bottomRef = useRef<HTMLDivElement | null>(null)
  const { listRef, onScroll, loadingMore, hasMore, didPrependRef } =
    useInfiniteChatMessages(chatId, messages)

  useChatAutoScroll({
    chatId,
    messagesLength: messages.length,
    listRef,
    bottomRef,
    didPrependRef,
  })

  const {
    editingId,
    editText,
    setEditText,
    isBusy,
    canEditOrDelete,
    startEdit,
    saveEdit,
    cancelEdit,
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

  const close = useCallback(() => {
    actions.closeWindow()
  }, [actions])

  const send = useCallback(async () => {
    if (isClosed || sending) return
    const trimmed = text.trim()
    if (!trimmed) return

    setSending(true)
    try {
      await chatHubClient.sendMessage(chatId, trimmed)
      setText("")
    } catch (error) {
      console.error("Chat send failed", error)
    } finally {
      setSending(false)
    }
  }, [chatId, isClosed, sending, text])

  const onKeyDownSend = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") return
      e.preventDefault()
      void send()
    },
    [send]
  )

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
        ref={listRef}
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
              <MessageRow
                key={m.id}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[78%] ${mine ? "text-right" : "text-left"}`}
                >
                  <div className="mb-1 text-[11px] text-muted-foreground">
                    {mine ? "Ty" : displayTitle} •{" "}
                    {new Date(m.createdAt).toLocaleString()}
                    {m.editedAt ? " (edyt.)" : ""}
                  </div>

                  <div className="group flex items-start gap-2">
                    <div className="pt-1">
                      {canEditOrDelete(m) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              disabled={busy || deleted}
                              className="rounded-md p-1 hover:bg-accent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="start">
                            <DropdownMenuItem
                              onClick={() => startEdit(m)}
                              disabled={busy || deleted || editExpired}
                              className={
                                busy || deleted || editExpired
                                  ? ""
                                  : "cursor-pointer"
                              }
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              {editExpired ? "Edycja wygasła" : "Edytuj"}
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className={
                                busy || deleted
                                  ? "text-destructive"
                                  : "text-destructive cursor-pointer"
                              }
                              onClick={() => deleteMessage(m.id)}
                              disabled={busy || deleted}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Usuń
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>

                    <div
                      className={[
                        "inline-block rounded-2xl px-3 py-2 leading-snug shadow-sm border",
                        mine
                          ? "bg-primary text-primary-foreground border-primary/30 rounded-br-sm"
                          : "bg-muted text-foreground border-border rounded-bl-sm",
                        deleted ? "opacity-70 italic" : "",
                      ].join(" ")}
                    >
                      {editingId === m.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && saveEdit(m.id)
                            }
                            disabled={busy}
                          />

                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => saveEdit(m.id)}
                            disabled={busy}
                            className="cursor-pointer"
                          >
                            <Check className="h-4 w-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={cancelEdit}
                            disabled={busy}
                            className="cursor-pointer"
                          >
                            <XIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        m.message
                      )}
                    </div>
                  </div>
                </div>
              </div>
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

export default ChatWindow

const MessageRow = memo(
  ({
    m,
    mine,
    busy,
    deleted,
    editExpired,
    displayTitle,
    editingId,
    editText,
    setEditText,
    canEditOrDelete,
    startEdit,
    saveEdit,
    cancelEdit,
    deleteMessage,
  }: {
    m: ChatMessage
    mine: boolean
    busy: boolean
    deleted: boolean
    editExpired: boolean
    displayTitle: string
    editingId: number | null
    editText: string
    setEditText: (v: string) => void
    canEditOrDelete: (m: ChatMessage) => boolean
    startEdit: (m: ChatMessage) => void
    saveEdit: (id: number) => void
    cancelEdit: () => void
    deleteMessage: (id: number) => void
  }) => {
    return (
      <div
        key={m.id}
        className={`flex ${mine ? "justify-end" : "justify-start"}`}
      >
        <div className={`max-w-[78%] ${mine ? "text-right" : "text-left"}`}>
          <div className="mb-1 text-[11px] text-muted-foreground">
            {mine ? "Ty" : displayTitle} •{" "}
            {new Date(m.createdAt).toLocaleString()}
            {m.editedAt ? " (edyt.)" : ""}
          </div>

          <div className="group flex items-start gap-2">
            <div className="pt-1">
              {canEditOrDelete(m) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      disabled={busy || deleted}
                      className="rounded-md p-1 hover:bg-accent opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      onClick={() => startEdit(m)}
                      disabled={busy || deleted || editExpired}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      {editExpired ? "Edycja wygasła" : "Edytuj"}
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => deleteMessage(m.id)}
                      disabled={busy || deleted}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Usuń
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <div
              className={[
                "inline-block rounded-2xl px-3 py-2 leading-snug shadow-sm border",
                mine
                  ? "bg-primary text-primary-foreground border-primary/30 rounded-br-sm"
                  : "bg-muted text-foreground border-border rounded-bl-sm",
                deleted ? "opacity-70 italic" : "",
              ].join(" ")}
            >
              {editingId === m.id ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit(m.id)}
                    disabled={busy}
                  />

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => saveEdit(m.id)}
                    disabled={busy}
                  >
                    <Check className="h-4 w-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={cancelEdit}
                    disabled={busy}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                m.message
              )}
            </div>
          </div>
        </div>
      </div>
    )
  },
  (p, n) => {
    const ma = p.m
    const mb = n.m
    return (
      ma.id === mb.id &&
      ma.message === mb.message &&
      ma.editedAt === mb.editedAt &&
      ma.deletedAt === mb.deletedAt &&
      p.mine === n.mine &&
      p.busy === n.busy &&
      p.editingId === n.editingId
    )
  }
)
