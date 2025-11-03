import { columns, User } from '@/components/data-table/columns';
import { DataTable } from '@/components/data-table/data-table';
import { usePostStore } from '@/store/postStore';

type Props = {
  data?: User[];
  onAddData?: (data: User) => void;
};

export default function NewlyAddedUsersTable({ data, onAddData }: Props) {
  const { newPosts, addPost, removePost } = usePostStore();

  const handleAdd = (d: User) => {
    if (onAddData) return onAddData(d);
    addPost(d);
  };

  const handleDeleteSelected = (rows: User[]) => {
    rows.forEach((r) => removePost(r.id));
  };

  return (
    <div className="mb-8">
      <DataTable
        columns={columns}
        data={data ?? newPosts ?? []}
        onAddData={handleAdd}
        onDeleteSelected={handleDeleteSelected}
      />
    </div>
  );
}
