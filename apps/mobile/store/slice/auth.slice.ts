import { Roles } from '@mixafrica/shared/enums';
import { loginProps } from '@mixafrica/shared/types/api/responses';
import { IUser } from '@mixafrica/shared/types/user';
import { type StateCreator } from 'zustand';

export interface AuthSlice {
  user: IUser | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  isLoggedIn: boolean;
  role: Roles | null;
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
  loading: false, // Loading is now handled by persist middleware hydration
  isLoggedIn: false,
  role: null,
  login: ({ user, token, refreshToken }) => {
    set({
      user,
      token,
      refreshToken,
      isLoggedIn: true,
      role: user?.role,
    });
  },
  logout: () => {
    set({
      user: null,
      token: null,
      refreshToken: null,
      isLoggedIn: false,
      role: null,
    });
  },
});
