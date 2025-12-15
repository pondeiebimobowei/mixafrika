import type { StateCreator } from 'zustand';
import type { BaseSlice } from '..';
import { IBankCard } from '@mixafrica/shared/types/bank-cards';
import { getBankCards } from '@/axios/bank-card';

export interface UserBankCard extends BaseSlice {
  loading: boolean;
  error: string | null;

  bank_cards: IBankCard[];
  getBankCards: () => void;

}

export const createUserBankCard: StateCreator<UserBankCard, [], [], UserBankCard> = (
  set
) => ({
  loading: false,
  error: null,

  bank_cards: [],

  getBankCards: async () => {
    set({ loading: true, error: null });

    const { data, success, message } = await getBankCards();
    
    if (success) {
      set({ bank_cards: data });
    } else {
      set({ error: message });
    }
    set({ loading: false });
  }
});
