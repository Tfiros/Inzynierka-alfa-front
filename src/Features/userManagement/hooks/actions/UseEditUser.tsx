import { useCallback, useEffect, useMemo, useState } from "react"
import type {
  UpdateUserRequestDto,
  UserListItemDto,
} from "@/shared/types/userTypes/UserManagementTypes"
import useUserDetails from "../UseUserDetails"

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
  const [profileDescription, setProfileDescription] = useState("")
  const [initialProfileDescription, setInitialProfileDescription] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [roles, setRoles] = useState<string[]>([])
  const [initialRoles, setInitialRoles] = useState<string[]>([])
  const [localError, setLocalError] = useState<string | null>(null)

  const { loadingDetails, detailsError, fetchUserDetails, resetDetailsState } =
    useUserDetails()

  useEffect(() => {
    if (!open || !user) return

    let cancelled = false

    const load = async () => {
      resetRequestState()
      resetDetailsState()
      setLocalError(null)

      setNickname(user.name ?? "")
      setEmail(user.email ?? "")
      setProfileDescription("")
      setInitialProfileDescription("")
      setNewPassword("")
      setRoles([])
      setInitialRoles([])

      const details = await fetchUserDetails(user.auth0UserId)

      if (cancelled) return

      const fetchedRoles = details?.roles ?? []
      const fetchedDescription = details?.profileDescription ?? ""

      setRoles(fetchedRoles)
      setInitialRoles(fetchedRoles)

      setProfileDescription(fetchedDescription)
      setInitialProfileDescription(fetchedDescription)
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [open, user, resetRequestState, resetDetailsState, fetchUserDetails])

  useEffect(() => {
    if (!open) {
      resetRequestState()
      resetDetailsState()
      setLocalError(null)
      setProfileDescription("")
      setInitialProfileDescription("")
      setRoles([])
      setInitialRoles([])
    }
  }, [open, resetRequestState, resetDetailsState])

  const toggleRole = useCallback((r: string, checked: boolean) => {
    setRoles((prev) => {
      const has = prev.some((x) => x.toLowerCase() === r.toLowerCase())

      if (checked && !has) return [...prev, r]

      if (!checked && has) {
        return prev.filter((x) => x.toLowerCase() !== r.toLowerCase())
      }

      return prev
    })
  }, [])

  const rolesChanged = useMemo(() => {
    const a = [...roles].map(normLower).sort()
    const b = [...initialRoles].map(normLower).sort()

    if (a.length !== b.length) return true

    return a.some((x, i) => x !== b[i])
  }, [roles, initialRoles])

  const body = useMemo<UpdateUserRequestDto | null>(() => {
    if (!user) return null

    const nextNick = norm(nickname)
    const nextEmail = norm(email)
    const nextDescription = profileDescription.trim()
    const nextPwd = norm(newPassword)

    const originalEmail = norm(user.email ?? "")
    const originalNick = norm(user.name ?? "")
    const originalDescription = initialProfileDescription.trim()

    const emailChanged =
      nextEmail.length > 0 && normLower(nextEmail) !== normLower(originalEmail)

    const nickChanged = nextNick.length > 0 && nextNick !== originalNick

    const descriptionChanged = nextDescription !== originalDescription

    return {
      authZeroUserId: user.auth0UserId,
      nickname: nickChanged ? nextNick : null,
      email: emailChanged ? nextEmail : null,
      profileDescription: descriptionChanged ? nextDescription : null,
      newPassword: nextPwd ? nextPwd : null,
      roles: rolesChanged ? roles : null,
    }
  }, [
    user,
    nickname,
    email,
    profileDescription,
    initialProfileDescription,
    newPassword,
    roles,
    rolesChanged,
  ])

  const canSave = useMemo(() => {
    if (!body || loadingDetails) return false

    return (
      Boolean(body.nickname) ||
      Boolean(body.email) ||
      body.profileDescription !== null ||
      Boolean(body.newPassword) ||
      body.roles !== null
    )
  }, [body, loadingDetails])

  const displayError = localError ?? detailsError ?? requestError

  return {
    nickname,
    setNickname,

    email,
    setEmail,

    profileDescription,
    setProfileDescription,

    newPassword,
    setNewPassword,

    roles,
    toggleRole,

    loadingDetails,
    detailsError,

    body,
    canSave,

    localError,
    setLocalError,
    displayError,
  }
}

export default useEditUser
