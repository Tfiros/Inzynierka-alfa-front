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

const FilterBar = () => {
  return (
    <section className="grid md:grid-cols-5 gap-6 items-center grid-cols-1 border-b pb-4">
      <div className="md:col-span-3 items-center relative">
        <Search className="absolute ml-3 mt-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Szukaj przedmioty..." className=" pl-9 bg-muted" />
      </div>
      <div className="md:col-span-2 flex flex-row gap-2 justify-between">
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Kategoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Gry</SelectLabel>
              <SelectItem value="csgo">CS:GO</SelectItem>
              <SelectItem value="valorant">Valorant</SelectItem>
              <SelectItem value="dota2">Dota 2</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Rzadkość" />
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Rzadkość</SelectLabel>
                <SelectItem value="csgo">CS:GO</SelectItem>
                <SelectItem value="valorant">Valorant</SelectItem>
                <SelectItem value="dota2">Dota 2</SelectItem>
              </SelectGroup>
            </SelectContent>
          </SelectTrigger>
        </Select>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sortowanie" />
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sortowanie</SelectLabel>
                <SelectItem value="newest">Najnowsze</SelectItem>
                <SelectItem value="oldest">Najstarsze</SelectItem>
                <SelectItem value="cheapest">Najtańsze</SelectItem>
                <SelectItem value="most_expensive">Najdroższe</SelectItem>
              </SelectGroup>
            </SelectContent>
          </SelectTrigger>
        </Select>
      </div>
    </section>
  )
}

export default FilterBar
