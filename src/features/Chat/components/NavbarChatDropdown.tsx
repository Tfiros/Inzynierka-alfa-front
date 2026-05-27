import { useEffect, useState } from "react"
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
import type { AppState } from "@auth0/auth0-react"
import type { ChatThreadListItemDto } from "@/shared/types/chat/ChatDtos"
import { chatThreadTitle } from "@/shared/utilities/Chat/chatThreadTitle"
import { useDebounceValue } from "@/shared/hooks/UseDebounceValue"
import { Input } from "@/shared/components/input"

const threadId = (t: ChatThreadListItemDto) => Number(t.chatConversationId)
const threadPreview = (t: ChatThreadListItemDto) => t.lastMessageText ?? ""
const threadUnread = (t: ChatThreadListItemDto) => t.unreadCount ?? 0

const NavbarChatDropdown = () => {
  const openThread = useOpenThread()

  const isPopoverOpen = useAppStore(chatSelectors.isPopoverOpen)
  const isWindowOpen = useAppStore(chatSelectors.isWindowOpen)
  const threads = useAppStore(chatSelectors.threads)
  const actions = useAppStore(chatSelectors.chatActions)
  const totalUnread = useAppStore(chatSelectors.totalUnread)

  const isAuthenticated = useAppStore((s: AppState) => s.isAuthenticated)
  const clearUnreadChatsLocal = useAppStore(
    (s: AppState) => s.clearUnreadChatsLocal
  )
  const markChatReadLocal = useAppStore((s: AppState) => s.markChatReadLocal)

  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounceValue(search, 360)
  const trimmedSearch = debouncedSearch.trim()

  useChatHub(isAuthenticated)

  useChatThreads({
    enabled: isPopoverOpen || isWindowOpen,
    page: 1,
    pageSize: 50,
    search: trimmedSearch.length ? trimmedSearch : null,
  })

  useChatAutoSubscribe()

  useEffect(() => {
    if (isPopoverOpen) clearUnreadChatsLocal()
  }, [isPopoverOpen, clearUnreadChatsLocal])

  const handleOpen = async (t: ChatThreadListItemDto) => {
    const id = threadId(t)
    if (!Number.isFinite(id) || id <= 0) return

    markChatReadLocal(id)

    actions.closePopover()
    await openThread(id, t.tradeId, t.closedAtUtc, chatThreadTitle(t))
  }

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

        <DropdownMenuContent align="end" className="w-[360px] p-0">
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

          <div className="max-h-[320px] overflow-auto p-2">
            {threads.map((t: ChatThreadListItemDto) => {
              const id = threadId(t)
              const isClosed = !!t.closedAtUtc
              if (!Number.isFinite(id) || id <= 0) return null

              return (
                <button
                  key={id}
                  type="button"
                  className="w-full rounded-lg px-3 py-2 text-left hover:bg-accent"
                  onClick={() => handleOpen(t)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
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
            })}

            {!threads.length && (
              <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                {trimmedSearch ? "Brak wyników" : "Brak konwersacji"}
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default NavbarChatDropdown
