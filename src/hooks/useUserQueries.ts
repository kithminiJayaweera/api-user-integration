/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query'
// import { User } from '@/components/data-table/columns'
import { fetchUsers, fetchUserById } from '@/apis/user' // <-- ensure these are exported from your api file

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
}

export function useUsers() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useUser(id: number | undefined | null) {
  return useQuery({
    queryKey: id ? userKeys.detail(Number(id)) : userKeys.details(),
    queryFn: async () => {
      if (!id) throw new Error('Invalid id')
      return fetchUserById(Number(id))
    },
    enabled: !!id,
  })
}