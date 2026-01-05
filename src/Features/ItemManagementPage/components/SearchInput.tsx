import { Input } from "@/shared/components/input"
import { Search } from "lucide-react"

const SearchInput = (props: {
  value: string
  onChange: (v: string) => void
  placeholder: string
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-2.5 h-4 w-4 opacity-50" />
      <Input
        className="pl-9"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
      />
    </div>
  )
}
export default SearchInput
