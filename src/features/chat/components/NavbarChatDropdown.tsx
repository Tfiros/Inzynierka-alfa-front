import { memo, useCallback, useState } from "react"
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
import ChatThreadItem from "./ChatThreadItem"

const threadId = (t: ChatThreadListItemDto) => Number(t.chatConversationId)

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
  const onlineMap = useAppStore(chatSelectors.onlineMap)

  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounceValue(search, 360)
  const trimmedSearch = debouncedSearch.trim()

  useChatHub(isAuthenticated)

  const { loadMore, loading: threadsLoading } = useChatThreads({
    enabled: isPopoverOpen || isWindowOpen,
    search: trimmedSearch.length ? trimmedSearch : null,
  })

  useChatAutoSubscribe()

  const handleOpen = useCallback(
    async (t: ChatThreadListItemDto) => {
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
    },
    [actions, markChatReadLocal, openThread]
  )

  return (
    <DropdownMenu
      open={isPopoverOpen}
      onOpenChange={(v) => (v ? actions.openPopover() : actions.closePopover())}
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
          {threads.map((t) => {
            const id = threadId(t)
            if (!Number.isFinite(id) || id <= 0) return null

            return (
              <ChatThreadItem
                key={id}
                thread={t}
                online={threadOnline(t, onlineMap)}
                onOpen={handleOpen}
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
  )
}

export default memo(NavbarChatDropdown)
