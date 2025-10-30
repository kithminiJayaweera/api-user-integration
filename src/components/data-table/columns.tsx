/* eslint-disable react-refresh/only-export-components */
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit, Trash2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { UserForm } from '@/components/form/add-post-form';
import { usePostStore } from '@/store/postStore';
import { UserDetailsDialog } from '@/components/form/user-details-dialog';
import { DataTableColumnHeader } from './table-columns-dropdown';

export const UserSchema = z.object({
  id: z.number().min(1, 'ID must be greater than 0'),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters'),
  age: z
    .number()
    .min(1, 'Age must be greater than 0')
    .max(120, 'Age must be less than 120'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .refine(
      (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
      },
      { message: 'Please enter a valid email address' }
    )
    .refine(
      (email) => {
        const domain = email.split('@')[1];
        return domain && domain.includes('.');
      },
      { message: 'Email must have a valid domain' }
    ),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .refine(
      (phone) => {
        const phoneRegex = /^(\+\d{1,3}[- ]?)?\(?\d{1,4}\)?[- ]?\d{1,4}[- ]?\d{1,9}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
      },
      { message: 'Please enter a valid phone number (e.g., +1 123 456 7890 or +94 77 123 4567)' }
    ),
  birthDate: z
    .string()
    .min(1, 'Birth date is required')
    .refine(
      (date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return selectedDate <= today;
      },
      { message: 'Birth date cannot be in the future' }
    ),
  gender: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="ml-2 h-6 w-6 p-0"
      title={copied ? 'Copied!' : 'Copy'}
    >
      {copied ? (
        <Check className="h-3 w-3 text-green-600" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  );
}

function ActionsCell({ user }: { user: User }) {
  const [showDialog, setShowDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { updatePost, removePost } = usePostStore();

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this user?')) {
      removePost(user.id);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDialog(true)}
          className="h-8 w-8 p-0"
        >
          <Eye className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowEditDialog(true)}
          className="h-8 w-8 p-0"
        >
          <Edit className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      <UserDetailsDialog
        user={user}
        open={showDialog}
        onOpenChange={setShowDialog}
      />

      <UserForm
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        initialData={user}
        isEdit
        onSubmit={async (updatedUser) => {
          updatePost(updatedUser);
        }}
      />
    </>
  );
}

function ViewOnlyActionsCell({ user }: { user: User }) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDialog(true)}
          className="h-8 w-8 p-0"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>

      <UserDetailsDialog
        user={user}
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </>
  );
}

export const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        aria-label="Select all"
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
        className="h-4 w-4"
        // use inline accentColor for broad browser support and keep Tailwind classes minimal
        style={{ accentColor: '#000' }}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        aria-label={`Select row ${row.id}`}
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        className="h-4 w-4"
        style={{ accentColor: '#000' }}
      />
    ),
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: 'firstName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
  },
  {
    accessorKey: 'lastName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
  },
  {
    accessorKey: 'age',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Age" />
    ),
  },
  {
    accessorKey: 'gender',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="truncate max-w-[200px]">{row.getValue('email')}</span>
        <CopyButton text={row.getValue('email')} />
      </div>
    ),
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <span>{row.getValue('phone')}</span>
        <CopyButton text={row.getValue('phone')} />
      </div>
    ),
  },
  {
    accessorKey: 'birthDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date of Birth" />
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ActionsCell user={row.original} />,
  },
];

export const apiColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: 'firstName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
  },
  {
    accessorKey: 'lastName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
  },
  {
    accessorKey: 'age',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Age" />
    ),
  },
  {
    accessorKey: 'gender',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="truncate max-w-[200px]">{row.getValue('email')}</span>
        <CopyButton text={row.getValue('email')} />
      </div>
    ),
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <span>{row.getValue('phone')}</span>
        <CopyButton text={row.getValue('phone')} />
      </div>
    ),
  },
  {
    accessorKey: 'birthDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date of Birth" />
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ViewOnlyActionsCell user={row.original} />,
  },
];
