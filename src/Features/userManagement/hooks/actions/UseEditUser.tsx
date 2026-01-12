import { useCallback, useEffect, useMemo, useState } from "react"
import type {
  UpdateUserRequestDto,
  UserListItemDto,
} from "@/shared/types/userTypes/UserManagementTypes"
import { de } from "date-fns/locale"

const norm = (v: string) => v.trim()
const normLower = (v: string) => v.trim().toLowerCase()

type UseEditUserDialogArgs = {
  open: boolean
  user: UserListItemDto | null
  resetRequestState: () => void
  requestError: string | null
}

const useEditUser = ({
  open,
  user,
  resetRequestState,
  requestError,
}: UseEditUserDialogArgs) => {
  const [nickname, setNickname] = useState("")
  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [roles, setRoles] = useState<string[]>([])
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !user) return

    resetRequestState()
    setLocalError(null)

    setNickname(user.name ?? "")
    setEmail(user.email ?? "")
    setNewPassword("")
    setRoles(user.roles ?? [])
  }, [open, user, resetRequestState])

  useEffect(() => {
    if (!open) {
      resetRequestState()
      setLocalError(null)
    }
  }, [open, resetRequestState])

  const toggleRole = useCallback((r: string, checked: boolean) => {
    setRoles((prev) => {
      const has = prev.some((x) => x.toLowerCase() === r.toLowerCase())
      if (checked && !has) return [...prev, r]
      if (!checked && has)
        return prev.filter((x) => x.toLowerCase() !== r.toLowerCase())
      return prev
    })
  }, [])

  const body = useMemo<UpdateUserRequestDto | null>(() => {
    if (!user) return null

    const nextNick = norm(nickname)
    const nextEmail = norm(email)
    const nextPwd = norm(newPassword)

    const originalEmail = norm(user.email ?? "")
    const originalNick = norm(user.name ?? "")

    const emailChanged =
      nextEmail.length > 0 && normLower(nextEmail) !== normLower(originalEmail)
    const nickChanged = nextNick.length > 0 && nextNick !== originalNick

    return {
      authZeroUserId: user.auth0UserId,
      nickname: nickChanged ? nextNick : null,
      email: emailChanged ? nextEmail : null,
      newPassword: nextPwd ? nextPwd : null,
      roles,
    }
  }, [user, nickname, email, newPassword, roles])

  const canSave = useMemo(() => {
    if (!body) return false
    const hasSomething =
      Boolean(body.nickname) ||
      Boolean(body.email) ||
      Boolean(body.newPassword) ||
      Array.isArray(body.roles)
    return hasSomething
  }, [body])

  const displayError = localError ?? requestError

  return {
    nickname,
    setNickname,
    email,
    setEmail,
    newPassword,
    setNewPassword,
    roles,
    toggleRole,
    body,
    canSave,
    localError,
    setLocalError,
    displayError,
  }
}
export default useEditUser
