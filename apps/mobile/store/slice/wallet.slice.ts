import type { StateCreator } from 'zustand';
import type { BaseSlice } from '..';
import { apiPrivate } from '@/axios/axios-config';
import { IWallet } from '@mixafrica/shared/types/wallet';
import { fundWallet } from '@/axios/wallet';
export interface UserWallet extends BaseSlice, Omit<IWallet, 'user_id'> {
  setWallet: ({ amount, total_portfolio }: IWallet) => void;
  getWalletBalance: () => void;
  fundWallet: (amount: number) =>void ;
}

export const createUserWallet: StateCreator<UserWallet, [], [], UserWallet> = (
  set, get
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
    set({ loading: false });
  },

  fundWallet: async (amount: number) => {
    set({ loading: true, error: null });
    const { success, message, data } = await fundWallet(amount);

    if (success) {
      get().getWalletBalance();

    } else {
      set({ error: message });
    }

    set({ loading: false });
  }
});
