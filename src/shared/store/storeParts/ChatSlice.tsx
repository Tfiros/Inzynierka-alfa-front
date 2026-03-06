import type { StateCreator } from "zustand"
import type {
  ChatMessage,
  ChatThreadListItemDto,
} from "@/shared/types/chat/ChatDtos"

export type ChatSlice = {
  chat: {
    isPopoverOpen: boolean
    isWindowOpen: boolean
    activeChatId: number | null
    activeChatTitle: string | null

    threads: ChatThreadListItemDto[]
    messagesByChatId: Record<number, ChatMessage[]>
    onlineMap: Record<string, boolean>

    actions: {
      openPopover: () => void
      closePopover: () => void

      openWindow: (chatId: number, title?: string | null) => void
      closeWindow: () => void

      setThreads: (items: ChatThreadListItemDto[]) => void

      setMessages: (chatId: number, items: ChatMessage[]) => void
      prependMessages: (chatId: number, items: ChatMessage[]) => void
      appendMessage: (chatId: number, msg: ChatMessage) => void

      updateMessage: (
        chatId: number,
        messageId: number,
        patch: Partial<ChatMessage>
      ) => void
      markDeletedById: (messageId: number) => void

      setUserOnline: (auth0UserId: string, isOnline: boolean) => void
      resetUnread: (chatId: number) => void
      incrementUnread: (chatId: number) => void
      applyReadState: (chatId: number, unreadCount: number) => void

      resetChat: () => void
    }
  }
}

export const createChatSlice: StateCreator<any, [], [], ChatSlice> = (set) => ({
  chat: {
    isPopoverOpen: false,
    isWindowOpen: false,
    activeChatId: null,
    activeChatTitle: null,

    threads: [],
    messagesByChatId: {},
    onlineMap: {},

    actions: {
      openPopover: () =>
        set((s: any) => ({ chat: { ...s.chat, isPopoverOpen: true } })),

      closePopover: () =>
        set((s: any) => ({ chat: { ...s.chat, isPopoverOpen: false } })),

      openWindow: (chatId: number, title?: string | null) =>
        set((s: any) => ({
          chat: {
            ...s.chat,
            isWindowOpen: true,
            activeChatId: chatId,
            activeChatTitle:
              title ?? s.chat.activeChatTitle ?? `Chat #${chatId}`,
            isPopoverOpen: false,
          },
        })),

      closeWindow: () =>
        set((s: any) => ({
          chat: {
            ...s.chat,
            isWindowOpen: false,
            activeChatId: null,
            activeChatTitle: null,
          },
        })),

      setThreads: (items) =>
        set((s: any) => ({ chat: { ...s.chat, threads: items } })),

      setMessages: (chatId, items) =>
        set((s: any) => ({
          chat: {
            ...s.chat,
            messagesByChatId: { ...s.chat.messagesByChatId, [chatId]: items },
          },
        })),

      prependMessages: (chatId, items) =>
        set((s: any) => {
          const prev: ChatMessage[] = s.chat.messagesByChatId?.[chatId] ?? []
          const existingIds = new Set(prev.map((m) => m.id))
          const unique = items.filter((m) => !existingIds.has(m.id))
          if (!unique.length) return s

          return {
            chat: {
              ...s.chat,
              messagesByChatId: {
                ...s.chat.messagesByChatId,
                [chatId]: [...unique, ...prev],
              },
            },
          }
        }),

      appendMessage: (chatId, msg) =>
        set((s: any) => {
          const prev: ChatMessage[] = s.chat.messagesByChatId?.[chatId] ?? []
          if (prev.some((x) => x.id === msg.id)) return s

          return {
            chat: {
              ...s.chat,
              messagesByChatId: {
                ...s.chat.messagesByChatId,
                [chatId]: [...prev, msg],
              },
            },
          }
        }),

      updateMessage: (chatId: number, messageId: number, patch: any) =>
        set((s: any) => {
          const prev = s.chat.messagesByChatId?.[chatId] ?? []
          const next = prev.map((m: any) =>
            m.id === messageId ? { ...m, ...patch } : m
          )

          return {
            chat: {
              ...s.chat,
              messagesByChatId: {
                ...s.chat.messagesByChatId,
                [chatId]: next,
              },
            },
          }
        }),

      // delete event nie ma chatId – aktualizujemy wszystkie chaty
      markDeletedById: (messageId: number) =>
        set((s: any) => {
          const byChat = s.chat.messagesByChatId ?? {}
          const nextByChat: any = { ...byChat }

          for (const k of Object.keys(byChat)) {
            const chatId = Number(k)
            nextByChat[chatId] = (byChat[chatId] ?? []).map((m: any) =>
              m.id === messageId
                ? {
                    ...m,
                    message: "[deleted]",
                    deletedAt: new Date().toISOString(),
                  }
                : m
            )
          }

          return { chat: { ...s.chat, messagesByChatId: nextByChat } }
        }),

      setUserOnline: (auth0UserId, isOnline) =>
        set((s: any) => ({
          chat: {
            ...s.chat,
            onlineMap: { ...s.chat.onlineMap, [auth0UserId]: isOnline },
          },
        })),

      resetUnread: (chatId) =>
        set((s: any) => ({
          chat: {
            ...s.chat,
            threads: s.chat.threads.map((t: any) =>
              (t.chatConversationId ?? t.chatId ?? t.id) === chatId
                ? { ...t, unreadCount: 0 }
                : t
            ),
          },
        })),

      incrementUnread: (chatId) =>
        set((s: any) => ({
          chat: {
            ...s.chat,
            threads: s.chat.threads.map((t: any) =>
              (t.chatConversationId ?? t.chatId ?? t.id) === chatId
                ? { ...t, unreadCount: (t.unreadCount ?? 0) + 1 }
                : t
            ),
          },
        })),

      applyReadState: (chatId, unreadCount) =>
        set((s: any) => ({
          chat: {
            ...s.chat,
            threads: s.chat.threads.map((t: any) =>
              (t.chatConversationId ?? t.chatId ?? t.id) === chatId
                ? { ...t, unreadCount }
                : t
            ),
          },
        })),

      resetChat: () =>
        set((s: any) => ({
          chat: {
            ...s.chat,
            isPopoverOpen: false,
            isWindowOpen: false,
            activeChatId: null,
            activeChatTitle: null,
            threads: [],
            messagesByChatId: {},
            onlineMap: {},
          },
        })),
    },
  },
})
