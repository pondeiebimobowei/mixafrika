import type { StateCreator } from 'zustand';
import type { BaseSlice } from '..';
import { apiPrivate } from '@/axios/axios-config';
import { IWallet } from '@mixafrica/shared/types/wallet';
import { fundWallet } from '@/axios/wallet';

export interface UserWallet extends BaseSlice {
  id: string,
  available_balance: number,
  active_investment_principal: number,
  total_growth_earned: number

  setWallet: ({ available_balance, active_investment_principal }: IWallet) => void;
  getWalletBalance: () => void;
  fundWallet: (available_balance: number) => void;
}

export const createUserWallet: StateCreator<UserWallet, [], [], UserWallet> = (
  set, get
) => ({
  id: '',
  loading: false,
  error: null,

  total_growth_earned: 0,
  available_balance: 0,
  active_investment_principal: 0,

  setWallet: ({ available_balance, active_investment_principal }) => {
    set({ available_balance, active_investment_principal });
  },

  getWalletBalance: async () => {
    set({ loading: true, error: null });

    try {
      const {
        data: {
          data: { id, available_balance, active_investment_principal },
        },
      } = await apiPrivate.get('wallet');
      set({ available_balance, id, active_investment_principal });
    } catch (err: any) {
      if (err.response) {
        set({ error: err.response.data.message, loading: false });
      } else {
        set({ error: err.message, loading: false });
      }
    }
    set({ loading: false });
  },

  fundWallet: async (available_balance: number) => {
    set({ loading: true, error: null });
    const { success, message, data } = await fundWallet(available_balance);

    if (success) {
      get().getWalletBalance();

    } else {
      set({ error: message });
    }

    set({ loading: false });
  }
});
