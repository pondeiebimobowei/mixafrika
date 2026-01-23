
import { getAllUsers } from '@/axios/user';
import type { IUser } from '../../../../../packages/shared/src/types/user';
import { type StateCreator } from 'zustand';


export interface UsersSlice {
  user: IUser[];
  loading: boolean;
  error: string | null;
  get_all_users: () => void;
}

export const createUserSlice: StateCreator<
  UsersSlice,
  [['zustand/immer', never]],
  [],
  UsersSlice
> = (set) => ({
  user: [],
  error: null,
  loading: false, // Loading is now handled by persist middleware hydration
  
  get_all_users: async() => {
    set({ loading: true, error: null });
    
        const { data, success, message } = await getAllUsers();
        
        if (success) {
          set({ user: data });
        } else {
          set({ error: message });
        }
        set({ loading: false });
    
  },
});
