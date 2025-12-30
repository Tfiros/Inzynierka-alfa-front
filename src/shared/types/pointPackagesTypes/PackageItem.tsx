export type PackageKey = 'starter' | 'popular' | 'premium' | 'ultimate'

export type PackageItem = {
  key: PackageKey
  title: string
  price: string
  coins: number
  bonus?: number
  highlight?: 'Najpopularniejszy' | 'Najlepszy stosunek ceny'
  accent?: 'blue' | 'green'
}

export const PACKAGES: PackageItem[] = [
  { key: 'starter', title: 'Pakiet Starter', price: '9.99€', coins: 100 },
  {
    key: 'popular',
    title: 'Pakiet Popular',
    price: '39.99€',
    coins: 500,
    bonus: 50,
    highlight: 'Najpopularniejszy',
    accent: 'blue',
  },
  {
    key: 'premium',
    title: 'Pakiet Premium',
    price: '69.99€',
    coins: 1000,
    bonus: 150,
    highlight: 'Najlepszy stosunek ceny',
    accent: 'green',
  },
  {
    key: 'ultimate',
    title: 'Pakiet Ultimate',
    price: '149.99€',
    coins: 2500,
    bonus: 500,
  },
]
