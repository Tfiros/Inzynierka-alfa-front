import { useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/dropdown-menu"
import { Button } from "@/shared/components/button"
import { MessageCircle, MessageSquare } from "lucide-react"

import useChatHub from "../hooks/UseChatHub"
import useChatThreads from "../hooks/UseChatThreads"
import NewDmDialog from "./NewDmDialog"
import useOpenThread from "../hooks/UseOpenThread"
import { useAppStore, chatSelectors } from "@/shared/store/appStore"
import { useChatAutoSubscribe } from "../hooks/UseThreadsSubscriptions"

const threadId = (t: any) => Number(t.chatConversationId ?? t.chatId ?? t.id)
const threadTitle = (t: any) =>
  t.displayName ?? t.title ?? `Chat #${threadId(t)}`
const threadPreview = (t: any) =>
  t.lastMessageText ?? t.lastMessagePreview ?? ""
const threadUnread = (t: any) => t.unreadCount ?? 0

const NavbarChatDropdown = () => {
  const [newDmOpen, setNewDmOpen] = useState(false)
  const openThread = useOpenThread()

  const isPopoverOpen = useAppStore(chatSelectors.isPopoverOpen)
  const isWindowOpen = useAppStore(chatSelectors.isWindowOpen)
  const threads = useAppStore(chatSelectors.threads)
  const actions = useAppStore(chatSelectors.chatActions)
  const totalUnread = useAppStore(chatSelectors.totalUnread)

  const isAuthenticated = useAppStore((s: any) => s.isAuthenticated)
  const clearUnreadChatsLocal = useAppStore((s: any) => s.clearUnreadChatsLocal)
  const markChatReadLocal = useAppStore((s: any) => s.markChatReadLocal)

  useChatHub(isAuthenticated)

  useChatThreads({
    enabled: isPopoverOpen || isWindowOpen,
    page: 1,
    pageSize: 50,
    search: null,
  })

  useChatAutoSubscribe()

  useEffect(() => {
    if (isPopoverOpen) clearUnreadChatsLocal()
  }, [isPopoverOpen, clearUnreadChatsLocal])

  const handleOpen = async (t: any) => {
    const id = threadId(t)
    if (!Number.isFinite(id) || id <= 0) return

    markChatReadLocal(id)

    actions.closePopover()
    await openThread(id, threadTitle(t))
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

          <DropdownMenuSeparator />

          <div className="max-h-[320px] overflow-auto p-2">
            {threads.map((t: any) => {
              const id = threadId(t)
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
                      <div className="truncate text-sm font-medium">
                        {threadTitle(t)}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {threadPreview(t)}
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
                Brak konwersacji
              </div>
            )}
          </div>

          <DropdownMenuSeparator />

          <div className="p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center gap-2"
              onClick={() => setNewDmOpen(true)}
            >
              <MessageSquare className="h-4 w-4" />
              Nowa wiadomość
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <NewDmDialog open={newDmOpen} onOpenChange={setNewDmOpen} />
    </>
  )
}

export default NavbarChatDropdown
