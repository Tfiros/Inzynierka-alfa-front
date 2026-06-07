import { Input } from "@/shared/components/input"
import { Button } from "@/shared/components/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/select"
import SearchInput from "../components/SearchInput"
import { SimplePagination } from "@/shared/components/Pagination"
import EntityCard from "../components/EntityCard"
import { DeleteEntityDialog } from "../components/DeleteEntityDialog"
import EditItemDialog from "../components/EditDialogs/EditItemDialog"
import AddItemDialog from "../components/AddDialogs/AddItemDialog"
import useItemsTab from "../hooks/UseItemsTab"

const ItemsTab = () => {
  const vm = useItemsTab()

  return (
    <div className="space-y-4">
      <Select
        value={String(vm.game.id ?? "")}
        onValueChange={(v) => vm.game.setId(Number(v))}
        open={vm.game.open}
        onOpenChange={vm.game.setOpen}
      >
        <SelectTrigger>
          <SelectValue placeholder="Wybierz grę..." />
        </SelectTrigger>

        <SelectContent>
          <div className="p-2">
            <Input
              value={vm.game.search}
              onChange={(e) => vm.game.setSearch(e.target.value)}
              placeholder="Szukaj gry..."
              onKeyDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            />
          </div>

          {vm.game.items.length === 0 ? (
            <div className="px-3 pb-2 text-sm opacity-70">Brak wyników</div>
          ) : (
            vm.game.items.map((g) => (
              <SelectItem key={g.id} value={String(g.id)}>
                {g.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      <div className="flex items-center justify-end">
        <Button onClick={vm.actions.openAdd}>Dodaj itemek</Button>
      </div>

      <SearchInput
        value={vm.list.search}
        onChange={vm.list.setSearch}
        placeholder="Szukaj itemków..."
      />

      {vm.list.error && (
        <div className="text-sm text-red-600">{vm.list.error}</div>
      )}
      {vm.list.loading && (
        <div className="text-sm opacity-70">Ładowanie...</div>
      )}

      {!vm.game.id ? (
        <div className="text-sm opacity-70">
          Wybierz grę, aby zobaczyć itemki.
        </div>
      ) : (
        <div className="space-y-3">
          {vm.list.items.map((i) => (
            <EntityCard
              key={i.id}
              title={i.name}
              metaLeft={`Gra: ${i.gameName}`}
              id={i.id}
              isItemOrGame={true}
              thumbnailUrl={i.photo_URL || undefined}
              onEdit={() => vm.actions.openEdit(i)}
              onDelete={() => vm.actions.openDelete(i)}
            />
          ))}
        </div>
      )}

      <SimplePagination {...vm.list.paginator} />

      <AddItemDialog
        open={vm.add.open}
        onOpenChange={vm.add.setOpen}
        gameId={vm.add.game.id}
        onGameChange={(v) => vm.add.game.setId(v)}
        gamesOpen={vm.add.game.open}
        onGamesOpenChange={vm.add.game.setOpen}
        gameSearch={vm.add.game.search}
        onGameSearchChange={vm.add.game.setSearch}
        games={vm.add.game.items}
        name={vm.add.name}
        onNameChange={vm.add.setName}
        token={vm.add.token}
        onTokenChange={vm.add.setToken}
        rarityId={vm.add.rarity.id}
        onRarityChange={(v) => vm.add.rarity.setId(v)}
        raritiesOpen={vm.add.rarity.open}
        onRaritiesOpenChange={vm.add.rarity.setOpen}
        raritySearch={vm.add.rarity.search}
        onRaritySearchChange={vm.add.rarity.setSearch}
        rarities={vm.add.rarity.items}
        saving={vm.add.saving}
        image={vm.add.image}
        onImageChange={vm.add.setImage}
        canSubmit={
          !!vm.add.game.id &&
          !!vm.add.name.trim() &&
          !!vm.add.rarity.id &&
          vm.add.isTokenOk
        }
        onSubmit={vm.actions.create}
      />

      {vm.edit.selected && (
        <>
          <EditItemDialog
            open={vm.edit.editOpen}
            onOpenChange={vm.edit.setEditOpen}
            initialName={vm.edit.selected.name}
            initialEstimatedTokenValue={vm.edit.selected.estimatedTokenValue}
            initialGameId={vm.edit.selected.gameId}
            initialRarityItemId={vm.edit.selected.itemRarityId}
            onSave={vm.actions.saveEdit}
          />

          <DeleteEntityDialog
            open={vm.edit.deleteOpen}
            onOpenChange={vm.edit.setDeleteOpen}
            title="Usunąć itemek?"
            description="Ta operacja ustawi IsDeleted=true. Item zniknie z list, ale historia zostaje."
            onConfirm={vm.actions.confirmDelete}
          />
        </>
      )}
    </div>
  )
}

export default ItemsTab
