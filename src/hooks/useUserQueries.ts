/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { User } from '@/components/data-table/columns';

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};

// API functions
async function fetchUsers(): Promise<User[]> {
  const res = await axios.get('https://dummyjson.com/users');
  const users: User[] = res.data.users.map((user: any) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    age: user.age,
    gender: user.gender,
    email: user.email,
    phone: user.phone,
    birthDate: user.birthDate,
  }));
  return users;
}

async function createUser(userData: Omit<User, 'id'>): Promise<User> {
  // For demo purposes, simulate API call
  const res = await axios.post('https://dummyjson.com/users/add', userData);
  return {
    id: res.data.id || Date.now(), // Fallback to timestamp if no ID returned
    ...userData,
  };
}

async function updateUser(userData: User): Promise<User> {
  // For demo purposes, simulate API call
  const res = await axios.put(`https://dummyjson.com/users/${userData.id}`, userData);
  return {
    ...userData,
    ...res.data,
  };
}

async function deleteUser(id: number): Promise<void> {
  await axios.delete(`https://dummyjson.com/users/${id}`);
}

// React Query hooks
export function useUsers() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createUser,
    onSuccess: (newUser) => {
      // Optimistically update the cache
      queryClient.setQueryData<User[]>(userKeys.lists(), (old) => {
        if (!old) return [newUser];
        return [...old, newUser];
      });
      
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedUser) => {
      // Optimistically update the cache
      queryClient.setQueryData<User[]>(userKeys.lists(), (old) => {
        if (!old) return [updatedUser];
        return old.map((user) => 
          user.id === updatedUser.id ? updatedUser : user
        );
      });
      
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (_, deletedId) => {
      // Optimistically update the cache
      queryClient.setQueryData<User[]>(userKeys.lists(), (old) => {
        if (!old) return [];
        return old.filter((user) => user.id !== deletedId);
      });
      
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

// Hook to get user by ID (for details view)
export function useUser(id: number) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const res = await axios.get(`https://dummyjson.com/users/${id}`);
      return {
        id: res.data.id,
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        age: res.data.age,
        gender: res.data.gender,
        email: res.data.email,
        phone: res.data.phone,
        birthDate: res.data.birthDate,
      } as User;
    },
    enabled: !!id,
  });
}