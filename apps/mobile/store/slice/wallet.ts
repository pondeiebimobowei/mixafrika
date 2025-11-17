import type { StateCreator } from 'zustand';
import type { BaseSlice } from '..';
import { apiPrivate } from '@/axios';
import { IWallet } from '@mixafrica/shared/types/wallet';
export interface UserWallet extends BaseSlice, Omit<IWallet, 'user_id'> {
  setWallet: ({ amount, total_portfolio }: IWallet) => void;
  getWalletBalance: () => void;
}

export const createUserWallet: StateCreator<UserWallet, [], [], UserWallet> = (
  set,
) => ({
  loading: false,
  error: null,

  amount: 0,
  total_portfolio: 0,

  setWallet: ({ amount, total_portfolio }) => {
    set({ amount, total_portfolio });
  },

  getWalletBalance: async () => {
    set({ loading: true, error: null });

    try {
      const {
        data: {
          data: { amount, total_portfolio },
        },
      } = await apiPrivate.get('wallet');
      set({ amount, total_portfolio });
    } catch (err: any) {
      if (err.response) {
        set({ error: err.response.data.message, loading: false });
      } else {
        set({ error: err.message, loading: false });
      }
    }
  },
});
