export const EDIT_WINDOW_MS = 5 * 60 * 1000

export const isMessageEditExpired = (createdAt: string) => {
  const createdAtMs = new Date(createdAt).getTime()
  return (
    !Number.isFinite(createdAtMs) || Date.now() - createdAtMs > EDIT_WINDOW_MS
  )
}
