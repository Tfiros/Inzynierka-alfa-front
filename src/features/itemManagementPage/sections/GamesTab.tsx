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
import EditGameDialog from "../components/EditDialogs/EditGameDialog"
import AddGameDialog from "../components/AddDialogs/AddGameDialog"
import useGamesTab from "../hooks/UseGamesTab"

const GamesTab = () => {
  const vm = useGamesTab()

  return (
    <div className="space-y-4">
      <Select
        value={String(vm.genre.id ?? "")}
        onValueChange={(v) => vm.genre.setId(Number(v))}
        open={vm.genre.open}
        onOpenChange={vm.genre.setOpen}
      >
        <SelectTrigger>
          <SelectValue placeholder="Wybierz gatunek..." />
        </SelectTrigger>

        <SelectContent>
          <div className="p-2">
            <Input
              value={vm.genre.search}
              onChange={(e) => vm.genre.setSearch(e.target.value)}
              placeholder="Szukaj gatunku..."
              onKeyDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            />
          </div>

          {vm.genre.items.length === 0 ? (
            <div className="px-3 pb-2 text-sm opacity-70">Brak wyników</div>
          ) : (
            vm.genre.items.map((g) => (
              <SelectItem key={g.id} value={String(g.id)}>
                {g.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      <div className="flex items-center justify-between gap-3">
        <div className="text-sm opacity-70">
          {vm.genre.id
            ? `Gatunek: ${vm.genre.selectedName}`
            : "Wybierz gatunek"}
        </div>
        <Button onClick={vm.actions.openAdd} disabled={!vm.genre.id}>
          Dodaj grę
        </Button>
      </div>

      <SearchInput
        value={vm.list.search}
        onChange={vm.list.setSearch}
        placeholder="Szukaj gier..."
      />

      {vm.list.error && (
        <div className="text-sm text-red-600">{vm.list.error}</div>
      )}
      {vm.list.loading && (
        <div className="text-sm opacity-70">Ładowanie...</div>
      )}

      <div className="space-y-3">
        {vm.list.items.map((g) => (
          <EntityCard
            key={g.id}
            title={g.name}
            metaLeft={
              vm.genre.id ? `Gatunek: ${vm.genre.selectedName}` : undefined
            }
            id={g.id}
            isItemOrGame={true}
            thumbnailUrl={g.photo_URL || undefined}
            onEdit={() => vm.actions.openEdit(g)}
            onDelete={() => vm.actions.openDelete(g)}
          />
        ))}
      </div>

      <SimplePagination {...vm.list.paginator} />

      <AddGameDialog
        open={vm.ui.addOpen}
        onOpenChange={vm.ui.setAddOpen}
        genres={vm.genre.items}
        initialGenreId={vm.genre.id}
        onSave={vm.actions.create}
      />

      {vm.ui.selected && (
        <>
          <EditGameDialog
            open={vm.ui.editOpen}
            onOpenChange={vm.ui.setEditOpen}
            initialName={vm.ui.selected.name}
            initialGenreId={vm.ui.selected.genreId}
            genres={vm.genre.items}
            onSave={vm.actions.saveEdit}
          />

          <DeleteEntityDialog
            open={vm.ui.deleteOpen}
            onOpenChange={vm.ui.setDeleteOpen}
            title="Usunąć grę?"
            description="Ta operacja ustawi IsDeleted=true. Gra zniknie z list, ale historia zostaje."
            onConfirm={vm.actions.confirmDelete}
          />
        </>
      )}
    </div>
  )
}

export default GamesTab
