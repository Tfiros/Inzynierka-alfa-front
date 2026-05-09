import type { StateCreator } from "zustand"
import type {
  ChatMessage,
  ChatThreadListItemDto,
} from "@/shared/types/chat/ChatDtos"

type ChatState = {
  isPopoverOpen: boolean
  isWindowOpen: boolean
  activeChatId: number | null
  activeChatTradeId: number | null
  activeChatClosedAt: string | null
  activeChatTitle: string | null

  threads: ChatThreadListItemDto[]
  messagesByChatId: Record<number, ChatMessage[]>
  onlineMap: Record<string, boolean>
}

type ChatActions = {
  openPopover: () => void
  closePopover: () => void

  openWindow: (
    chatId: number,
    tradeId: number,
    closedAtUtc?: string | null,
    title?: string | null
  ) => void
  closeWindow: () => void
  markThreadClosed: (chatId: number, closedAtUtc: string) => void

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

export type ChatSlice = {
  chat: ChatState & {
    actions: ChatActions
  }
}

const initialChatState: ChatState = {
  isPopoverOpen: false,
  isWindowOpen: false,
  activeChatId: null,
  activeChatTitle: null,
  activeChatTradeId: null,
  activeChatClosedAt: null,
  threads: [],
  messagesByChatId: {},
  onlineMap: {},
}

const getThreadChatId = (thread: ChatThreadListItemDto): number =>
  thread.chatConversationId

export const createChatSlice: StateCreator<ChatSlice, [], [], ChatSlice> = (
  set
) => ({
  chat: {
    ...initialChatState,

    actions: {
      openPopover: () =>
        set((state) => ({
          chat: {
            ...state.chat,
            isPopoverOpen: true,
          },
        })),

      closePopover: () =>
        set((state) => ({
          chat: {
            ...state.chat,
            isPopoverOpen: false,
          },
        })),

      openWindow: (
        chatId: number,
        tradeId: number,
        closedAtUtc?: string | null,
        title?: string | null
      ) =>
        set((state) => ({
          chat: {
            ...state.chat,
            isWindowOpen: true,
            activeChatId: chatId,
            activeChatTitle: title ?? null,
            activeChatTradeId: tradeId,
            activeChatClosedAt: closedAtUtc ?? null,
            isPopoverOpen: false,
          },
        })),

      closeWindow: () =>
        set((state) => ({
          chat: {
            ...state.chat,
            isWindowOpen: false,
            activeChatId: null,
            activeChatTitle: null,
            activeChatTradeId: null,
            activeChatClosedAt: null,
          },
        })),
      markThreadClosed: (chatId: number, closedAtUtc: string) =>
        set((state) => ({
          chat: {
            ...state.chat,
            threads: state.chat.threads.map((thread) =>
              getThreadChatId(thread) === chatId
                ? { ...thread, closedAtUtc }
                : thread
            ),
            activeChatClosedAt:
              state.chat.activeChatId === chatId
                ? closedAtUtc
                : state.chat.activeChatClosedAt,
          },
        })),

      setThreads: (items: ChatThreadListItemDto[]) =>
        set((state) => ({
          chat: {
            ...state.chat,
            threads: items,
          },
        })),

      setMessages: (chatId: number, items: ChatMessage[]) =>
        set((state) => ({
          chat: {
            ...state.chat,
            messagesByChatId: {
              ...state.chat.messagesByChatId,
              [chatId]: items,
            },
          },
        })),

      prependMessages: (chatId: number, items: ChatMessage[]) =>
        set((state) => {
          const prev = state.chat.messagesByChatId[chatId] ?? []
          const existingIds = new Set(prev.map((m) => m.id))
          const unique = items.filter((m) => !existingIds.has(m.id))

          if (unique.length === 0) {
            return state
          }

          return {
            chat: {
              ...state.chat,
              messagesByChatId: {
                ...state.chat.messagesByChatId,
                [chatId]: [...unique, ...prev],
              },
            },
          }
        }),

      appendMessage: (chatId: number, msg: ChatMessage) =>
        set((state) => {
          const prev = state.chat.messagesByChatId[chatId] ?? []

          if (prev.some((x) => x.id === msg.id)) {
            return state
          }

          return {
            chat: {
              ...state.chat,
              messagesByChatId: {
                ...state.chat.messagesByChatId,
                [chatId]: [...prev, msg],
              },
            },
          }
        }),

      updateMessage: (
        chatId: number,
        messageId: number,
        patch: Partial<ChatMessage>
      ) =>
        set((state) => {
          const prev = state.chat.messagesByChatId[chatId] ?? []

          const next = prev.map((m) =>
            m.id === messageId ? { ...m, ...patch } : m
          )

          return {
            chat: {
              ...state.chat,
              messagesByChatId: {
                ...state.chat.messagesByChatId,
                [chatId]: next,
              },
            },
          }
        }),

      markDeletedById: (messageId: number) =>
        set((state) => {
          const byChat = state.chat.messagesByChatId
          const nextByChat: Record<number, ChatMessage[]> = {}

          for (const [chatIdRaw, messages] of Object.entries(byChat)) {
            const chatId = Number(chatIdRaw)

            nextByChat[chatId] = messages.map((m) =>
              m.id === messageId
                ? {
                    ...m,
                    message: "[deleted]",
                    deletedAt: new Date().toISOString(),
                  }
                : m
            )
          }

          return {
            chat: {
              ...state.chat,
              messagesByChatId: nextByChat,
            },
          }
        }),

      setUserOnline: (auth0UserId: string, isOnline: boolean) =>
        set((state) => ({
          chat: {
            ...state.chat,
            onlineMap: {
              ...state.chat.onlineMap,
              [auth0UserId]: isOnline,
            },
          },
        })),

      resetUnread: (chatId: number) =>
        set((state) => ({
          chat: {
            ...state.chat,
            threads: state.chat.threads.map((thread) =>
              getThreadChatId(thread) === chatId
                ? { ...thread, unreadCount: 0 }
                : thread
            ),
          },
        })),

      incrementUnread: (chatId: number) =>
        set((state) => ({
          chat: {
            ...state.chat,
            threads: state.chat.threads.map((thread) =>
              getThreadChatId(thread) === chatId
                ? { ...thread, unreadCount: (thread.unreadCount ?? 0) + 1 }
                : thread
            ),
          },
        })),

      applyReadState: (chatId: number, unreadCount: number) =>
        set((state) => ({
          chat: {
            ...state.chat,
            threads: state.chat.threads.map((thread) =>
              getThreadChatId(thread) === chatId
                ? { ...thread, unreadCount }
                : thread
            ),
          },
        })),

      resetChat: () =>
        set((state) => ({
          chat: {
            ...state.chat,
            ...initialChatState,
          },
        })),
    },
  },
})
