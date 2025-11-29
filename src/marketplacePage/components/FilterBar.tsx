import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'
type FilterBarProps = {
  search: string
  game: string
  rarity: string
  sortBy: string
  onSearchChange: (value: string) => void
  onGameChange: (value: string) => void
  onRarityChange: (value: string) => void
  onSortByChange: (value: string) => void
}

const FilterBar = ({
  search,
  game,
  rarity,
  sortBy,
  onSearchChange,
  onGameChange,
  onRarityChange,
  onSortByChange,
}: FilterBarProps) => {
  const GAME_OPTIONS = [
    { value: 'all', label: 'Wszystkie gry' },
    { value: 'csgo', label: 'CS:GO' },
    { value: 'valorant', label: 'Valorant' },
    { value: 'dota2', label: 'Dota 2' },
  ]
  const RARITY_OPTIONS = [
    { value: 'common', label: 'Common' },
    { value: 'uncommon', label: 'Uncommon' },
    { value: 'rare', label: 'Rare' },
    { value: 'epic', label: 'Epic' },
    { value: 'legendary', label: 'Legendary' },
  ]
  const SORT_OPTIONS = [
    { value: 'newest', label: 'Najnowsze' },
    { value: 'oldest', label: 'Najstarsze' },
    { value: 'cheapest', label: 'Najtańsze' },
    { value: 'most_expensive', label: 'Najdroższe' },
  ]
  return (
    <section className="grid md:grid-cols-5 gap-6 items-center grid-cols-1 border-b pb-4">
      <div className="md:col-span-3 items-center relative">
        <Search className="absolute ml-3 mt-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Szukaj przedmioty..."
          className=" pl-9 bg-muted"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="md:col-span-2 flex flex-col md:flex-row md:justify-between gap-2">
        <Select value={game} onValueChange={onGameChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Kategoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Gry</SelectLabel>
              {GAME_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select value={rarity} onValueChange={onRarityChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Rzadkość" />
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Rzadkość</SelectLabel>
                {RARITY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </SelectTrigger>
        </Select>
        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sortowanie" />
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sortowanie</SelectLabel>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </SelectTrigger>
        </Select>
      </div>
    </section>
  )
}

export default FilterBar
