import React, { useEffect, useState, memo } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/dropdown-menu"
import { Button } from "@/shared/components/button"
import { MessageCircle, Search } from "lucide-react"

import useChatHub from "../hooks/UseChatHub"
import useChatThreads from "../hooks/UseChatThreads"
import useOpenThread from "../hooks/UseOpenThread"
import { useAppStore, chatSelectors } from "@/shared/store/appStore"
import { useChatAutoSubscribe } from "../hooks/UseThreadsSubscriptions"
import type { ChatThreadListItemDto } from "@/shared/types/chat/ChatDtos"
import { chatThreadTitle } from "@/shared/utilities/Chat/chatThreadTitle"
import { useDebounceValue } from "@/shared/hooks/UseDebounceValue"
import { Input } from "@/shared/components/input"

const threadId = (t: ChatThreadListItemDto) => Number(t.chatConversationId)
const threadPreview = (t: ChatThreadListItemDto) => t.lastMessageText ?? ""
const threadUnread = (t: ChatThreadListItemDto) => t.unreadCount ?? 0
const threadOnline = (
  t: ChatThreadListItemDto,
  onlineMap: Record<string, boolean>
): boolean | null =>
  t.otherUserAuth0UserId
    ? (onlineMap[t.otherUserAuth0UserId] ?? t.isOnline ?? false)
    : null

const NavbarChatDropdown = () => {
  const openThread = useOpenThread()

  const isPopoverOpen = useAppStore(chatSelectors.isPopoverOpen)
  const isWindowOpen = useAppStore(chatSelectors.isWindowOpen)
  const threads = useAppStore(chatSelectors.threads)
  const actions = useAppStore(chatSelectors.chatActions)
  const totalUnread = useAppStore(chatSelectors.totalUnread)

  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  const markChatReadLocal = useAppStore((s) => s.markChatReadLocal)

  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounceValue(search, 360)
  const trimmedSearch = debouncedSearch.trim()
  const onlineMap = useAppStore(chatSelectors.onlineMap)

  useChatHub(isAuthenticated)

  const {
    loadMore,
    hasMore,
    loading: threadsLoading,
  } = useChatThreads({
    enabled: isPopoverOpen || isWindowOpen,
    search: trimmedSearch.length ? trimmedSearch : null,
  })

  useChatAutoSubscribe()

  const handleOpen = async (t: ChatThreadListItemDto) => {
    const id = threadId(t)
    if (!Number.isFinite(id) || id <= 0) return

    markChatReadLocal(id)

    actions.closePopover()
    await openThread(
      id,
      t.tradeId,
      t.closedAtUtc,
      chatThreadTitle(t),
      t.otherUserAuth0UserId,
      t.isOnline
    )
  }

  const ThreadItem = memo(
    ({
      t,
      online,
      onClick,
    }: {
      t: ChatThreadListItemDto
      online: boolean | null
      onClick: () => void
    }) => {
      const id = threadId(t)
      const isClosed = !!t.closedAtUtc

      return (
        <button
          key={id}
          type="button"
          className="w-full rounded-lg px-3 py-2 text-left hover:bg-accent"
          onClick={onClick}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {online !== null && (
                  <span
                    title={online ? "Online" : "Offline"}
                    className={`h-2 w-2 shrink-0 rounded-full ${online ? "bg-green-500" : "bg-muted-foreground/30"}`}
                  ></span>
                )}
                <div className="truncate text-sm font-medium">
                  {chatThreadTitle(t)}
                </div>
                {isClosed && (
                  <span className="shrink-0 rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">
                    Zamknięty
                  </span>
                )}
              </div>
              <div className="truncate text-xs text-muted-foreground">
                {isClosed ? "Czat zamknięty" : threadPreview(t)}
              </div>
            </div>

            {threadUnread(t) > 0 && (
              <div className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {threadUnread(t)}
              </div>
            )}
          </div>
        </button>
      )
    },
    (prev, next) => {
      const a = prev.t
      const b = next.t
      return (
        a.chatConversationId === b.chatConversationId &&
        (a.lastMessageText ?? "") === (b.lastMessageText ?? "") &&
        (a.unreadCount ?? 0) === (b.unreadCount ?? 0) &&
        a.closedAtUtc === b.closedAtUtc &&
        prev.online === next.online
      )
    }
  )

  return (
    <>
      <DropdownMenu
        open={isPopoverOpen}
        onOpenChange={(v) =>
          v ? actions.openPopover() : actions.closePopover()
        }
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            title="Wiadomości"
            className="relative"
          >
            <MessageCircle className="h-5 w-5" />

            {totalUnread > 0 && (
              <span className="absolute -right-1 -top-1 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-destructive-foreground text-[11px] leading-[18px] text-center">
                {totalUnread > 99 ? "99+" : totalUnread}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-[min(360px,calc(100vw-1rem))] p-0"
        >
          <div className="flex items-center justify-between px-4 py-3">
            <DropdownMenuLabel className="p-0">Wiadomości</DropdownMenuLabel>
            <div className="text-xs text-muted-foreground">
              {threads.length} wątków
            </div>
          </div>

          <div className="px-3 pb-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                placeholder="Szukaj (nick, #123)"
                className="pl-8"
              />
            </div>
          </div>

          <DropdownMenuSeparator />

          <div
            className="max-h-[320px] overflow-auto p-2"
            onScroll={(e) => {
              const el = e.currentTarget as HTMLDivElement
              if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
                void loadMore()
              }
            }}
          >
            {threads.map((t: ChatThreadListItemDto) => {
              const id = threadId(t)
              const online = threadOnline(t, onlineMap)
              if (!Number.isFinite(id) || id <= 0) return null

              return (
                <ThreadItem
                  key={id}
                  type="button"
                  className="w-full rounded-lg px-3 py-2 text-left hover:bg-accent cursor-pointer"
                  onClick={() => handleOpen(t)}
                />
              )
            })}

            {!threads.length && (
              <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                {trimmedSearch ? "Brak wyników" : "Brak konwersacji"}
              </div>
            )}

            {threadsLoading && (
              <div className="px-3 py-2 text-center text-xs text-muted-foreground">
                Ładowanie...
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default NavbarChatDropdown
