import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserSchema } from '@/components/data-table/columns';

interface UserStore {
  newPosts: User[];
  addPost: (user: User) => void;
  updatePost: (user: User) => void;
  removePost: (id: number) => void;
  clearPosts: () => void;
}

export const usePostStore = create<UserStore>()(
  persist(
    (set) => ({
      newPosts: [],
      addPost: (user) => {
        try {
          const validatedUser = UserSchema.parse(user);
          set((state) => {
            // append then renumber ids to keep them sequential (1..n)
            const appended = [...state.newPosts, validatedUser];
            const renumbered = appended.map((u, idx) => ({ ...u, id: idx + 1 }));
            // persist last id in sessionStorage
            try {
              sessionStorage.setItem('lastUserId', String(renumbered.length));
            } catch (e) {
              // ignore storage errors (e.g. SSR or disabled storage)
              console.debug('sessionStorage unavailable:', e);
            }
            return { newPosts: renumbered };
          });
        } catch (error) {
          console.error('Invalid user data:', error);
        }
      },
      updatePost: (user) => {
        try {
          const validatedUser = UserSchema.parse(user);
          set((state) => ({
            // keep ids of other posts intact; replace matching id
            newPosts: state.newPosts.map((p) => (p.id === validatedUser.id ? validatedUser : p)),
          }));
        } catch (error) {
          console.error('Invalid user data for update:', error);
        }
      },
      removePost: (id) => {
        set((state) => {
          const filtered = state.newPosts.filter((p) => p.id !== id);
          // renumber remaining posts to keep ids sequential
          const renumbered = filtered.map((u, idx) => ({ ...u, id: idx + 1 }));
          try {
            sessionStorage.setItem('lastUserId', String(renumbered.length));
          } catch (e) {
            // ignore storage errors (e.g. SSR or disabled storage)
            console.debug('sessionStorage unavailable:', e);
          }
          return { newPosts: renumbered };
        });
      },
      clearPosts: () => set({ newPosts: [] }),
    }),
    {
      name: 'new-users-storage',
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => sessionStorage.removeItem(name),
      },
    }
  )
);
