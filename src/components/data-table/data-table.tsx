/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TableColumnsDropdown from './table-columns-dropdown';
import RowsPerPageSelect from '@/components/customUi/rows-per-page-select';

import { UserForm } from '@/components/form/add-post-form';

import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  VisibilityState,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DataTablePagination } from '../customUi/pagination';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onAddData?: (newData: any) => void;
  onDeleteSelected?: (rows: TData[]) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onAddData,
  onDeleteSelected,
}: DataTableProps<TData, TValue>) {
  const [addOpen, setAddOpen] = React.useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [searchField, setSearchField] = React.useState<'firstName' | 'email' | 'id' | 'phone' | 'birthDate'>('email');
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data;
    const q = searchQuery.toLowerCase();
    return data.filter((row: any) => {
      if (searchField === 'email') return String(row.email ?? '').toLowerCase().includes(q);
      if (searchField === 'firstName') {
        const full = `${row.firstName ?? ''} ${row.lastName ?? ''}`.toLowerCase();
        return (
          full.includes(q) ||
          (row.firstName ?? '').toLowerCase().includes(q) ||
          (row.lastName ?? '').toLowerCase().includes(q)
        );
      }
      if (searchField === 'id') return String(row.id ?? '').toLowerCase().includes(q);
      if (searchField === 'phone') return String(row.phone ?? '').toLowerCase().includes(q);
      if (searchField === 'birthDate') return String(row.birthDate ?? '').toLowerCase().includes(q);
      return true;
    });
  }, [data, searchField, searchQuery]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Input
          placeholder={`Search by ${searchField === 'firstName' ? 'name' : searchField}...`}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
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

          {/* Delete selected (visible only when there are selected rows) */}
          {table.getSelectedRowModel().flatRows.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => {
                if (!confirm(`Delete ${table.getSelectedRowModel().flatRows.length} selected row(s)?`)) return;
                const rows = table.getSelectedRowModel().flatRows.map((r) => r.original as TData);
                if (onDeleteSelected) onDeleteSelected(rows);
                setRowSelection({});
              }}
            >
              Delete selected ({table.getSelectedRowModel().flatRows.length})
            </Button>
          )}

          <UserForm
            open={addOpen}
            onOpenChange={setAddOpen}
            onSubmit={async (data) => {
              if (onAddData) await onAddData(data);
            }}
          />
          <Button onClick={() => setAddOpen(true)}>Add Data</Button>
        </div>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <RowsPerPageSelect
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
            className="h-8 w-[70px]"
          />
        </div>
        <div className="flex justify-end">
          <DataTablePagination table={table} />
        </div>
      </div>
    </div>
  );
}

export default DataTable;
