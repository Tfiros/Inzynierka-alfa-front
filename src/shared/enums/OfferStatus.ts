export const OfferStatus = {
  Active: 1,
  Expired: 2,
  InRealization: 3,
  Completed: 4,
  Canceled: 5,
} as const
export type OfferStatus = (typeof OfferStatus)[keyof typeof OfferStatus]
