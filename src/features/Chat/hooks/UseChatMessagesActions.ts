import { useCallback, useMemo, useState } from "react"
import { ChatService } from "@/shared/api/services/ChatService"
import type { ChatMessage } from "@/shared/types/chat/ChatDtos"
import { isMessageEditExpired } from "@/shared/utilities/Chat/isMessageEditExpired"

type Params = {
  chatId: number
  userId: number | null
  isClosed: boolean
  messages: ChatMessage[]
  updateMessage: (
    chatId: number,
    messageId: number,
    patch: Partial<ChatMessage>
  ) => void
  markDeletedById: (messageId: number) => void
}

export const useChatMessageActions = ({
  chatId,
  userId,
  isClosed,
  messages,
  updateMessage,
  markDeletedById,
}: Params) => {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState("")
  const [busyMap, setBusyMap] = useState<Record<number, boolean>>({})

  const isBusy = useCallback(
    (messageId: number) => !!busyMap[messageId],
    [busyMap]
  )

  const setBusy = useCallback((messageId: number, v: boolean) => {
    setBusyMap((s) => {
      const next = { ...s }
      if (v) next[messageId] = true
      else delete next[messageId]
      return next
    })
  }, [])

  const canEditOrDelete = useCallback(
    (m: ChatMessage) => {
      if (!userId || isClosed) return false
      const isMine = m.senderId === userId
      const isDeleted = !!m.deletedAt || m.message === "[deleted]"
      return isMine && !isDeleted
    },
    [userId, isClosed]
  )

  const startEdit = useCallback(
    (m: ChatMessage) => {
      if (!canEditOrDelete(m)) return
      if (isMessageEditExpired(m.createdAt)) {
        return
      }
      setEditingId(m.id)
      setEditText(m.message ?? "")
    },
    [canEditOrDelete]
  )

  const cancelEdit = useCallback(() => {
    setEditingId(null)
    setEditText("")
  }, [])

  const saveEdit = useCallback(
    async (messageId: number) => {
      if (isClosed) return
      const txt = editText.trim()
      if (!txt) return
      const original = messages.find((m) => m.id === messageId)
      if (!original || isMessageEditExpired(original.createdAt)) return
      setBusy(messageId, true)
      try {
        // API: PUT /Chat/messages/{messageId}
        await ChatService.editMessage(messageId, { message: txt })

        // optimistic update w store
        updateMessage(chatId, messageId, {
          message: txt,
          editedAt: new Date().toISOString(),
        })

        setEditingId(null)
        setEditText("")
      } catch (e) {
        console.error("saveEdit failed", e)
      } finally {
        setBusy(messageId, false)
      }
    },
    [chatId, editText, isClosed, messages, setBusy, updateMessage]
  )

  const deleteMessage = useCallback(
    async (messageId: number) => {
      if (isClosed) return
      setBusy(messageId, true)
      try {
        await ChatService.deleteMessage(messageId)

        markDeletedById(messageId)

        if (editingId === messageId) {
          setEditingId(null)
          setEditText("")
        }
      } catch (e) {
        console.error("deleteMessage failed", e)
      } finally {
        setBusy(messageId, false)
      }
    },
    [editingId, isClosed, markDeletedById, setBusy]
  )

  return useMemo(
    () => ({
      editingId,
      editText,
      setEditText,
      isBusy,
      canEditOrDelete,
      startEdit,
      cancelEdit,
      saveEdit,
      deleteMessage,
    }),
    [
      editingId,
      editText,
      isBusy,
      canEditOrDelete,
      startEdit,
      cancelEdit,
      saveEdit,
      deleteMessage,
    ]
  )
}
