import { apiColumns, User } from '@/components/data-table/columns';
import { DataTable } from '@/components/data-table/data-table';
import { useUsers } from '@/hooks/useUserQueries';
import { usePostStore } from '@/store/postStore';
import { useNavigate } from 'react-router-dom';

type Props = {
  data?: User[];
  onAddData?: (data: User) => void;
};

export default function UsersTable({ data, onAddData }: Props) {
  const { data: apiData } = useUsers();
  const store = usePostStore();

  const navigate = useNavigate();

  const handleAdd = (d: User) => {
    if (onAddData) return onAddData(d);
    store.addPost(d);
    navigate('/newly-added');
  };

  return (
    <div className="mb-8">
      <DataTable columns={apiColumns} data={data ?? apiData ?? []} onAddData={handleAdd} />
    </div>
  );
}
