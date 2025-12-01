import { useState } from 'react'
import FilterBar from './FilterBar'

const FilterBarContainer = () => {
  const [search, setSearch] = useState('')
  const [game, setGame] = useState('all')
  const [rarity, setRarity] = useState('common')
  const [sortBy, setSortBy] = useState('newest')
  return (
    <FilterBar search={search} game={game} rarity={rarity} sortBy={sortBy} onSearchChange={setSearch} onGameChange={setGame} onRarityChange={setRarity} onSortByChange={setSortBy} />
  )
}

export default FilterBarContainer