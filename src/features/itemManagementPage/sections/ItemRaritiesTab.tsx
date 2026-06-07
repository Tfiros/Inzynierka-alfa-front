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
import AddItemRarityDialog from "../components/AddDialogs/AddItemRarityDialog"
import EditItemRarityDialog from "../components/EditDialogs/EditItemRarityDialog"
import useItemRaritiesTab from "../hooks/UseItemsRaritiesTab"

const ItemRaritiesTab = () => {
  const vm = useItemRaritiesTab()

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

      <div className="flex items-center justify-between gap-3">
        <div className="text-sm opacity-70">
          {vm.game.id ? `Filtr gry: ${vm.game.selectedName}` : "Wybierz grę"}
        </div>
        <Button onClick={vm.actions.openAdd}>Dodaj rzadkość</Button>
      </div>

      <SearchInput
        value={vm.list.search}
        onChange={vm.list.setSearch}
        placeholder="Szukaj rzadkości..."
      />

      {vm.list.error && (
        <div className="text-sm text-red-600">{vm.list.error}</div>
      )}
      {vm.list.loading && (
        <div className="text-sm opacity-70">Ładowanie...</div>
      )}

      {!vm.game.id ? (
        <div className="text-sm opacity-70">
          Wybierz grę, aby zobaczyć rzadkości itemków.
        </div>
      ) : (
        <div className="space-y-3">
          {vm.list.items.map((r) => (
            <EntityCard
              key={r.id}
              title={r.name}
              isItemOrGame={false}
              metaLeft={`Gra: ${vm.game.selectedName}`}
              id={r.id}
              onEdit={() => vm.actions.openEdit(r)}
              onDelete={() => vm.actions.openDelete(r)}
            />
          ))}
        </div>
      )}

      <SimplePagination {...vm.list.paginator} />

      <AddItemRarityDialog
        open={vm.ui.addOpen}
        onOpenChange={vm.ui.setAddOpen}
        initialGameId={vm.game.id}
        gameId={vm.dialogGame.id}
        onGameChange={vm.dialogGame.setId}
        gamesOpen={vm.dialogGame.open}
        onGamesOpenChange={vm.dialogGame.setOpen}
        gameSearch={vm.dialogGame.search}
        onGameSearchChange={vm.dialogGame.setSearch}
        games={vm.dialogGame.items}
        onSave={vm.actions.create}
      />

      {vm.ui.selected && (
        <>
          <EditItemRarityDialog
            open={vm.ui.editOpen}
            onOpenChange={vm.ui.setEditOpen}
            initialName={vm.ui.selected.name}
            initialGameId={vm.ui.selected.gameId ?? vm.game.id}
            gameId={vm.dialogGame.id}
            onGameChange={vm.dialogGame.setId}
            gamesOpen={vm.dialogGame.open}
            onGamesOpenChange={vm.dialogGame.setOpen}
            gameSearch={vm.dialogGame.search}
            onGameSearchChange={vm.dialogGame.setSearch}
            games={vm.dialogGame.items}
            onSave={vm.actions.saveEdit}
          />

          <DeleteEntityDialog
            open={vm.ui.deleteOpen}
            onOpenChange={vm.ui.setDeleteOpen}
            title="Usunąć rzadkość?"
            description="Ta operacja ustawi IsDeleted=true. Rzadkość zniknie z list, ale historia zostaje."
            onConfirm={vm.actions.confirmDelete}
          />
        </>
      )}
    </div>
  )
}

export default ItemRaritiesTab
