import { getUser } from '@/axios/user';
import { Roles } from '@mixafrica/shared/enums';
import { loginProps } from '@mixafrica/shared/types/api/responses';
import { IUser } from '@mixafrica/shared/types/user';
import { type StateCreator } from 'zustand';

export interface AuthSlice {
  user: IUser | null;
  token: string | null;
  refreshToken: string | null;
  error: string | null;
  loading: boolean;
  isLoggedIn: boolean;
  role: Roles | null;
  current_role: Roles | null;
  set_current_role: (role: Roles) => void;
  get_user: () => void;
  login: ({}: loginProps) => void;
  logout: () => void;
}

export const createAuthSlice: StateCreator<
  AuthSlice,
  [['zustand/immer', never]],
  [],
  AuthSlice
> = (set) => ({
  user: null,
  token: null,
  refreshToken: null,
  error: null,
  loading: false, // Loading is now handled by persist middleware hydration
  isLoggedIn: false,
  role: null,
  current_role: null,
  set_current_role: (role: Roles) => {
    set({
      current_role: role,
    });
  },

  get_user: async() => {
    set({ loading: true, error: null });
    
        const { data, success, message } = await getUser();
        
        if (success) {
          set({ user: data });
        } else {
          set({ error: message });
        }
        set({ loading: false });
    
  },
  login: ({ user, token, refreshToken, current_role }) => {
    set({
      user,
      token,
      current_role,
      refreshToken,
      isLoggedIn: true,
      role: user?.role,
    });
  },
  logout: () => {
    set({
      user: null,
      token: null,
      current_role: null,
      refreshToken: null,
      isLoggedIn: false,
      role: null,
    });
  },
});
