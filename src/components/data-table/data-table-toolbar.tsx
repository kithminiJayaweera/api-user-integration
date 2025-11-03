/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TableColumnsDropdown from './table-columns-dropdown';

type Props = {
  table: any;
  searchField: string;
  setSearchField: (v: string) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  onAddClick: () => void;
  onDeleteSelected?: (rows: any[]) => void;
  selectable?: boolean;
};

export default function DataTableToolbar({
  table,
  searchField,
  setSearchField,
  searchQuery,
  setSearchQuery,
  onAddClick,
  onDeleteSelected,
  selectable = false,
}: Props) {
  const selectedCount = table.getSelectedRowModel().flatRows.length;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <Input
        placeholder={`Search by ${searchField === 'firstName' ? 'name' : searchField}...`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="max-w-xs"
      />

      <Select value={searchField} onValueChange={(v) => setSearchField(v as any)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="firstName">Name</SelectItem>
          <SelectItem value="email">Email</SelectItem>
          <SelectItem value="id">ID</SelectItem>
          <SelectItem value="phone">Phone</SelectItem>
          <SelectItem value="birthDate">Date of Birth</SelectItem>
        </SelectContent>
      </Select>

      <div className="ml-auto flex items-center gap-2">
        <TableColumnsDropdown table={table} />

  {selectable && selectedCount > 0 && onDeleteSelected && (
          <Button
            variant="destructive"
            onClick={() => {
              if (!confirm(`Delete ${selectedCount} selected row(s)?`)) return;
              const rows = table.getSelectedRowModel().flatRows.map((r: any) => r.original);
              onDeleteSelected(rows);
              // clear selection via table API
              table.resetRowSelection();
            }}
          >
            Delete selected ({selectedCount})
          </Button>
        )}

        <Button onClick={onAddClick}>Add Data</Button>
      </div>
    </div>
  );
}
