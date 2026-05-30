export const CounterOfferStatus = {
  Pending: 1,
  Accepted: 2,
  Denied: 3,
} as const
export type CounterOfferStatus =
  (typeof CounterOfferStatus)[keyof typeof CounterOfferStatus]
