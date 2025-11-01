
import { type StateCreator } from 'zustand';
import { type Roles } from '../../../../packages/shared/src/enums';

import { type IuserWithBusiness } from '../../../../packages/shared/src/types/user'

export interface AuthSlice {
  user: IuserWithBusiness | null;
  loading: boolean;
  login: (email: string, role: Roles) => void;
  logout: () => void;
  initAuth: () => void;
}

export const createAuthSlice: StateCreator<
  AuthSlice,
  [['zustand/immer', never]],
  [],
  AuthSlice
> = (set) => ({
  user: null,
  loading: true,
  initAuth: () => {
    try {
      const storedUser = localStorage.getItem('clustr-user');
      if (storedUser) {
        set({ user: JSON.parse(storedUser) });
      }
    } catch (error) {
      console.error("Could not parse user from localStorage", error);
      localStorage.removeItem('clustr-user');
    }
    set({ loading: false });
  },
  login: (email, role) => {
    const mockUser: IuserWithBusiness = {
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      email,
      role,
      business: {
        name: role === 'trader' ? 'Aunty Funke' : '',
        address: '',
        phone: '',
        type: '',
        user_id: ''
      },
      credit_score: 0,
      credit_score_status: '',
      first_name: '',
      image: '',
      is_email_verified: false,
      is_verified: false, 
      last_name: '',
      password: '',
    };
    set({ user: mockUser });
    localStorage.setItem('clustr-user', JSON.stringify(mockUser));
  },
  logout: () => {
    set({ user: null });
    localStorage.removeItem('clustr-user');
  },
});
