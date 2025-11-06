import { productColumns, Product } from '@/components/data-table/product-columns';
import { DataTable } from '@/components/data-table/data-table';
import TableSkeleton from '@/components/customUi/TableSkeleton';
import { useProducts } from '@/hooks/useProductQueries';

type Props = {
  data?: Product[];
  onAddData?: (data: Product) => void;
};

export default function UsersTable({ data, onAddData }: Props) {
  const { data: apiData, isLoading } = useProducts();

  const productSearchFields = [
    { value: 'title', label: 'Title' },
    { value: 'brand', label: 'Brand' },
    { value: 'category', label: 'Category' },
    { value: 'id', label: 'ID' },
  ];

  if (isLoading) {
    return <TableSkeleton rows={10} columns={7} showImage={true} />;
  }

  return (
    <div className="mb-8">
      <DataTable
        columns={productColumns}
        data={data ?? apiData ?? []}
        onAddData={onAddData}
        searchFields={productSearchFields}
        defaultSearchField="title"
      />
    </div>
  );
}
