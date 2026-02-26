import { Filters } from '../../app/(protected)/(trader)/transactions';
import { getTransactions } from '@/axios/transaction';
import { ITransaction } from '@mixafrica/shared/types/transaction';
import { type StateCreator } from 'zustand';

export interface TransactionsSlice {
  loading: boolean,
  error: string | null,

  transactions: Record<string, ITransaction[]>;
  getTransactions: (type?: Filters) => void;
}

export const createTransactionsSlice: StateCreator<
  TransactionsSlice,
  [['zustand/immer', never]],
  [],
  TransactionsSlice
> = (set) => ({
  loading: false,
  error: null,

  transactions: {},

  getTransactions: async (type?: Filters) => {
    set({ loading: true, error: null });
    const { data, success, message } = await getTransactions(type);

    if (success) {
      set({ transactions: data as Record<string, ITransaction[]> });
    } else {
      set({ error: message })
    }

    set({ loading: false });
  }
});
