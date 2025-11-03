/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import DataTableToolbar from './data-table-toolbar';
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
import { createSelectionColumn } from './selection-column';

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

  const tableColumns = React.useMemo(() => {
    if (onDeleteSelected) {
      const sel = createSelectionColumn<TData>();
      // avoid inserting twice if the columns already include a selection column
      if (Array.isArray(columns) && columns[0]?.id !== sel.id) {
        return [sel as ColumnDef<TData, TValue>, ...columns];
      }
    }
    return columns;
  }, [columns, onDeleteSelected]);

  const table = useReactTable({
    data: filteredData,
    columns: tableColumns,
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
      <div className="mb-4">
        {/* Toolbar component - keeps DataTable file smaller and reusable */}
        <DataTableToolbar
          table={table}
          searchField={searchField}
          setSearchField={(v: string) => setSearchField(v as any)}
          searchQuery={searchQuery}
          setSearchQuery={(v: string) => setSearchQuery(v)}
          onAddClick={() => setAddOpen(true)}
          onDeleteSelected={onDeleteSelected}
        />
        <UserForm
          open={addOpen}
          onOpenChange={setAddOpen}
          onSubmit={async (data) => {
            if (onAddData) await onAddData(data);
          }}
        />
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
                <TableCell colSpan={table.getVisibleFlatColumns().length} className="h-24 text-center">
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
