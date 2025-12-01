import React from 'react'
import FilterBar from './FilterBar'

const FilterBarContainer = () => {
  const [search, setSearch] = React.useState('')
  const [game, setGame] = React.useState('all')
  const [rarity, setRarity] = React.useState('common')
  const [sortBy, setSortBy] = React.useState('newest')
  return (
    <FilterBar search={search} game={game} rarity={rarity} sortBy={sortBy} onSearchChange={setSearch} onGameChange={setGame} onRarityChange={setRarity} onSortByChange={setSortBy} />
  )
}

export default FilterBarContainer