export type MiddlemanJobStatus = "Planned" | "InProgress" | "Finished"

export type MiddlemanTab = "available" | "mine" | "finished"

export type PartyDto = {
  nickname: string
  gameOrCategory: string
  itemTitle: string
  itemSubtitle?: string | null
}

export type MiddlemanJobDto = {
  id: string
  createdAt: string
  status: MiddlemanJobStatus

  leftParty: PartyDto
  rightParty: PartyDto

  middlemanFeeCoins: number

  scheduledAt?: string | null
}

export type MiddlemanStatsDto = {
  total: number
  finished: number
  mineActive: number
  available: number
}
