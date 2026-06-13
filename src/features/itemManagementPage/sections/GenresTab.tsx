import SearchInput from "../components/SearchInput"
import { SimplePagination } from "@/shared/components/Pagination"
import { DeleteEntityDialog } from "../components/DeleteEntityDialog"
import EditGenreDialog from "../components/EditDialogs/EditGenreDialog"
import EntityCard from "../components/EntityCard"
import { Button } from "@/shared/components/button"
import AddGenreDialog from "../components/AddDialogs/AddGenreDialog"
import useGenresTab from "../hooks/UseGenresTab"

export const GenresTab = () => {
  const vm = useGenresTab()

  return (
    <div className="space-y-4">
      <SearchInput
        value={vm.list.search}
        onChange={vm.list.setSearch}
        placeholder="Szukaj gatunków..."
      />

      {vm.list.error && (
        <div className="text-sm text-red-600">{vm.list.error}</div>
      )}
      {vm.list.loading && (
        <div className="text-sm opacity-70">Ładowanie...</div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">Genres</div>
        <Button onClick={vm.actions.openAdd} className="cursor-pointer">
          Dodaj gatunek
        </Button>
      </div>

      <div className="space-y-3">
        {vm.list.items.map((g) => (
          <EntityCard
            key={g.id}
            title={g.name}
            id={g.id}
            isItemOrGame={false}
            onEdit={() => vm.actions.openEdit(g)}
            onDelete={() => vm.actions.openDelete(g)}
          />
        ))}
      </div>

      <AddGenreDialog
        open={vm.ui.addOpen}
        onOpenChange={vm.ui.setAddOpen}
        onSave={vm.actions.create}
      />

      <SimplePagination {...vm.list.paginator} />

      {vm.ui.selected && (
        <>
          <EditGenreDialog
            open={vm.ui.editOpen}
            onOpenChange={vm.ui.setEditOpen}
            initialName={vm.ui.selected.name}
            onSave={vm.actions.saveEdit}
          />

          <DeleteEntityDialog
            open={vm.ui.deleteOpen}
            onOpenChange={vm.ui.setDeleteOpen}
            title="Usunąć gatunek?"
            description="Ta operacja ustawi IsDeleted=true. Gatunek zniknie z list, ale historia zostaje."
            onConfirm={vm.actions.confirmDelete}
          />
        </>
      )}
    </div>
  )
}

export default GenresTab
