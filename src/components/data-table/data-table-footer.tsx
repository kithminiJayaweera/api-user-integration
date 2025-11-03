/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataTablePagination } from '@/components/customUi/pagination';
import RowsPerPageSelect from '@/components/customUi/rows-per-page-select';

type Props = {
  table: any;
};

export default function DataTableFooter({ table }: Props) {
  return (
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
  );
}
