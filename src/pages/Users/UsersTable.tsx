import { columns } from '@/components/data-table/columns';
import { DataTable } from '@/components/data-table/data-table';
import TableSkeleton from '@/components/customUi/TableSkeleton';
import { useMongoUsers, useCreateMongoUser } from '@/hooks/useMongoUsers';
import { usePostStore } from '@/store/postStore';
import { User } from '@/components/data-table/columns';
import { MongoUser } from '@/apis/user';
import { toast } from 'sonner';

export default function UsersTable() {
  const { data: mongoUsers, isLoading, error } = useMongoUsers();
  const { newPosts, addPost } = usePostStore();
  const createMutation = useCreateMongoUser();

  // UsersTable: render with MongoDB data (debug logs removed)

  const userSearchFields = [
    { value: 'firstName', label: 'First Name' },
    { value: 'lastName', label: 'Last Name' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' }
  ];

  const handleAddUser = async (userData: User) => {
    try {
      const mongoUserData: Omit<MongoUser, '_id' | 'id' | 'createdAt' | 'updatedAt'> = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        age: userData.age,
        phone: userData.phone,
        gender: userData.gender || 'other',
        birthDate: userData.birthDate
      };
      await createMutation.mutateAsync(mongoUserData);
      toast.success(`User "${userData.firstName} ${userData.lastName}" added to MongoDB!`);
    } catch (error) {
      console.error('❌ Failed to create user in MongoDB:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to add user: ${errorMessage}`);
      addPost(userData);
    }
  };

  if (isLoading) {
    return <TableSkeleton rows={10} columns={7} showImage={false} />;
  }

  if (error) {
    console.error('❌ MongoDB connection error:', error);
    return (
      <div className="mb-8">
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800 font-bold">
            ❌ Backend Connection Error
          </p>
          <p className="text-xs text-red-600 mt-1">
            {error.message}
          </p>
          <p className="text-xs text-gray-600 mt-2">
            Using local storage instead. Start backend server to connect to MongoDB.
          </p>
        </div>
        <DataTable
          columns={columns}
          data={newPosts}
          onAddData={handleAddUser}
          searchFields={userSearchFields}
          defaultSearchField="firstName"
        />
      </div>
    );
  }

  // Convert MongoUser to User format - ONLY use MongoDB data when connected
  const convertedMongoUsers: User[] = (mongoUsers || []).map(user => ({
    firstName: user.firstName,
    lastName: user.lastName,
    age: user.age,
    gender: user.gender,
    email: user.email,
    phone: user.phone,
    birthDate: user.birthDate,
    _id: user._id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }));

  // total users: convertedMongoUsers.length

  return (
    <div className="mb-8">
      {/* Status banner removed: connection status is implicit in functionality */}

      <DataTable
        columns={columns}
        data={convertedMongoUsers}
        onAddData={handleAddUser}
        searchFields={userSearchFields}
        defaultSearchField="firstName"
      />
    </div>
  );
}
