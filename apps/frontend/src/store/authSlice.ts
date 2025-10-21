
import { type StateCreator } from 'zustand';

export interface User {
  id: string;
  email: string;
  role: 'investor' | 'trader';
  businessName?: string;
}

export interface AuthSlice {
  user: User | null;
  loading: boolean;
  login: (email: string, role: 'investor' | 'trader') => void;
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
    const mockUser: User = {
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      email,
      role,
      businessName: role === 'trader' ? 'Aunty Funke' : undefined,
    };
    set({ user: mockUser });
    localStorage.setItem('clustr-user', JSON.stringify(mockUser));
  },
  logout: () => {
    set({ user: null });
    localStorage.removeItem('clustr-user');
  },
});
