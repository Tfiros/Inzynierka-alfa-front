import { Input } from "@/shared/components/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/select"
import { offerOrderBy } from "@/shared/types/offerTypes/OfferTypes"
import type {
  GameOfferDTO,
  GenreOfferDTO,
  RarityOfferDTO,
} from "@/shared/types/offerTypes/RequestResponseTypes"
import { Search } from "lucide-react"

type FilterBarProps = {
  searchText: string
  onSearchTextChange: (value: string) => void
  gameId: number | undefined
  onGameIdChange: (value: number | undefined) => void
  games: GameOfferDTO[]
  genreId: number | undefined
  onGenreIdChange: (value: number | undefined) => void
  genres: GenreOfferDTO[]
  rarityId: number | undefined
  onRarityIdChange: (value: number | undefined) => void
  rarities: RarityOfferDTO[]
  orderBy: offerOrderBy
  onOrderByChange: (value: offerOrderBy) => void
}

const ALL = "__all__"

const SORT_OPTIONS: { value: offerOrderBy; label: string }[] = [
  { value: offerOrderBy.newest, label: "Najnowsze" },
  { value: offerOrderBy.oldest, label: "Najstarsze" },
  { value: offerOrderBy.tokenCostAsc, label: "Najtańsze" },
  { value: offerOrderBy.tokenCostDesc, label: "Najdroższe" },
  { value: offerOrderBy.expDateAsc, label: "Wygasa najwcześniej" },
  { value: offerOrderBy.expDateDesc, label: "Wygasa najpóźniej" },
]

const FilterBar = ({
  searchText,
  onSearchTextChange,
  gameId,
  onGameIdChange,
  games,
  genreId,
  onGenreIdChange,
  genres,
  rarityId,
  onRarityIdChange,
  rarities,
  orderBy,
  onOrderByChange,
}: FilterBarProps) => {
  return (
    <section className="grid grid-cols-1 items-center gap-6 border-b pb-4 md:grid-cols-5">
      <div className="relative items-center md:col-span-2">
        <Search className="absolute ml-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Szukaj przedmioty..."
          className="pl-9 bg-muted"
          value={searchText}
          onChange={(e) => onSearchTextChange(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2 md:col-span-3 md:flex-row md:justify-between">
        <Select
          value={genreId?.toString() ?? ALL}
          onValueChange={(v) =>
            onGenreIdChange(v === ALL ? undefined : Number(v))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Gatunek" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Gatunek</SelectLabel>
              <SelectItem value={ALL}>Wszystkie gatunki</SelectItem>
              {genres.map((g) => (
                <SelectItem key={g.id} value={g.id.toString()}>
                  {g.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          value={gameId?.toString() ?? ALL}
          onValueChange={(v) =>
            onGameIdChange(v === ALL ? undefined : Number(v))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Gra" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Gry</SelectLabel>
              <SelectItem value={ALL}>Wszystkie gry</SelectItem>
              {games.map((g) => (
                <SelectItem key={g.id} value={g.id.toString()}>
                  {g.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          value={rarityId?.toString() ?? ALL}
          onValueChange={(v) =>
            onRarityIdChange(v === ALL ? undefined : Number(v))
          }
          disabled={gameId === undefined}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={gameId === undefined ? "Wybierz grę" : "Rzadkość"}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Rzadkość</SelectLabel>
              <SelectItem value={ALL}>Wszystkie rzadkości</SelectItem>
              {rarities.map((r) => (
                <SelectItem key={r.id} value={r.id.toString()}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={orderBy.toString()}
          onValueChange={(v) => onOrderByChange(Number(v) as offerOrderBy)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sortowanie" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sortowanie</SelectLabel>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value.toString()}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </section>
  )
}

export default FilterBar
