
import { type StateCreator } from 'zustand';
import type { Transaction } from '@/types';

const initialTransactions: Transaction[] = [
    {
      id: '7',
      type: 'credit' as const,
      title: 'Daily ROI - Onitsha Electronics',
      amount: 4800,
      date: '6th April, 2025',
      category: 'earnings',
    },
    {
      id: '2',
      type: 'debit' as const,
      title: 'Withdrawal',
      amount: 50000,
      date: '9th April, 2025',
      category: 'withdrawal',
    },
    {
      id: '5',
      type: 'debit' as const,
      title: 'Investment - Kano Grains',
      amount: 100000,
      date: '7th April, 2025',
      category: 'investment',
    },
    {
      id: '1',
      type: 'credit' as const,
      title: 'Daily ROI - Balogun Traders',
      amount: 5000,
      date: '10th April, 2025',
      category: 'earnings',
    },
    {
      id: '9',
      type: 'debit' as const,
      title: 'Withdrawal',
      amount: 25000,
      date: '4th April, 2025',
      category: 'withdrawal',
    },
    {
      id: '3',
      type: 'credit' as const,
      title: 'Daily ROI - Onitsha Electronics',
      amount: 4800,
      date: '9th April, 2025',
      category: 'earnings',
    },
    {
      id: '8',
      type: 'credit' as const,
      title: 'Daily ROI - Aba Shoes',
      amount: 1200,
      date: '5th April, 2025',
      category: 'earnings',
    },
    {
      id: '4',
      type: 'credit' as const,
      title: 'Daily ROI - Aba Shoes',
      amount: 1200,
      date: '8th April, 2025',
      category: 'earnings',
    },
    {
      id: '6',
      type: 'credit' as const,
      title: 'Daily ROI - Balogun Traders',
      amount: 5000,
      date: '7th April, 2025',
      category: 'earnings',
    },
    {
      id: '10',
      type: 'credit' as const,
      title: 'Daily ROI - Balogun Traders',
      amount: 5000,
      date: '4th April, 2025',
      category: 'earnings',
    },
    {
        id: '11',
        type: 'credit' as const,
        title: 'Deposit from Bank',
        amount: 200000,
        date: '10th Jan, 2024',
        category: 'deposit',
    },
];

export interface TransactionsSlice {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
}

export const createTransactionsSlice: StateCreator<
  TransactionsSlice,
  [['zustand/immer', never]],
  [],
  TransactionsSlice
> = (set) => ({
  transactions: initialTransactions,
  addTransaction: (transaction) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      ...transaction,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    };
    set((state) => {
      state.transactions.unshift(newTransaction);
    });
  },
});
