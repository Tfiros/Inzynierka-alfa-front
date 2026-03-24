import { useEffect, useRef, useState } from "react"
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

type Props = { chatId: number; title: string }

const EMPTY_MESSAGES: ChatMessage[] = []

const ChatWindow = ({ chatId, title }: Props) => {
  const actions = useAppStore(chatSelectors.chatActions)
  const userId = useAppStore((s: any) => s.userId as number | null)

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
    if (sending) return

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
    <div className="fixed bottom-6 right-6 z-50 w-[420px] overflow-hidden rounded-xl border bg-background shadow-lg">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{title}</div>
          <div className="text-xs text-muted-foreground">
            {loadingMore
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

            return (
              <div
                key={m.id}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[78%] ${mine ? "text-right" : "text-left"}`}
                >
                  <div className="mb-1 text-[11px] text-muted-foreground">
                    {mine ? "Ty" : title} •{" "}
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
                              disabled={busy || deleted}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edytuj
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
          placeholder="Napisz..."
          onKeyDown={onKeyDownSend}
        />

        <Button onClick={send} disabled={sending}>
          {sending ? "..." : "Wyślij"}
        </Button>
      </div>
    </div>
  )
}

export default ChatWindow
