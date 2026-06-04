export const TradeStatus = {
  New: 1,
  InRealization: 2,
  SuccesfulRealization: 3,
  Failed: 4,
} as const
export type TradeStatus = (typeof TradeStatus)[keyof typeof TradeStatus]
