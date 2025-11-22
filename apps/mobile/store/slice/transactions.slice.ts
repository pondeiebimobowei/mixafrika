import { getTransactions } from '@/axios/transaction';
import { ITransaction } from '@mixafrica/shared/types/transaction';
import { type StateCreator } from 'zustand';

export interface TransactionsSlice {
  loading: boolean,
  error: string | null,
  
  transactions: ITransaction[];
  getTransactions: () => void
}

export const createTransactionsSlice: StateCreator<
  TransactionsSlice,
  [['zustand/immer', never]],
  [],
  TransactionsSlice
> = (set) => ({
  loading: false,
  error: null,

  transactions: [],

  getTransactions: async ()=> {
    set({ loading: true, error: null });
    const { data, success, message } = await getTransactions();

    if(success){
      set({ transactions: data });
    }else{
      set({ error: message })
    }

    set({ loading: false });
  }
});
