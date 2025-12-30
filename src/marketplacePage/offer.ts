export type OfferGame = "CS:GO" | "Valorant" | "League of Legends" | "Dota 2"

export type OfferRarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary"

export interface OfferType {
  id: number
  title: string
  description: string
  rarity: OfferRarity
  date: string
  itemsHave: ItemType[]
  itemsWant: ItemType[]
  user: UserType
}

export interface ItemType {
  id: number
  name: string
  imageUrl: string
  rarity: OfferRarity
  game: OfferGame
}

export interface UserType {
  id: number
  username: string
  avatarUrl?: string
  rating: number
  tradesCount: number
}
