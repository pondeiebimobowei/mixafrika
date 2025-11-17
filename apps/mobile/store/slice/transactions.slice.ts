import { ITransaction } from '@mixafrica/shared/types/transaction';
import { type StateCreator } from 'zustand';

const initialTransactions: ITransaction[] = [
  {
    user_id: '7',
    type: 'deposit',
    status: 'active',
    title: 'Daily ROI - Onitsha Electronics',
    amount: 4800,
    createdAt: '6th April, 2025',
    category: 'earnings',
  },
  {
    user_id: '2',
    status: 'active',
    type: 'withdrawal',
    title: 'Withdrawal',
    amount: 50000,
    createdAt: '9th April, 2025',
    category: 'withdrawal',
  },
  {
    user_id: '5',
    status: 'active',
    type: 'withdrawal',
    title: 'Investment - Kano Grains',
    amount: 100000,
    createdAt: '7th April, 2025',
    category: 'investment',
  },
  {
    user_id: '1',
    status: 'active',
    type: 'deposit',
    title: 'Daily ROI - Balogun Traders',
    amount: 5000,
    createdAt: '10th April, 2025',
    category: 'earnings',
  },
  {
    user_id: '9',
    status: 'active',
    type: 'withdrawal',
    title: 'Withdrawal',
    amount: 25000,
    createdAt: '4th April, 2025',
    category: 'withdrawal',
  },
  {
    user_id: '3',
    status: 'active',
    type: 'deposit',
    title: 'Daily ROI - Onitsha Electronics',
    amount: 4800,
    createdAt: '9th April, 2025',
    category: 'earnings',
  },
  {
    user_id: '8',
    status: 'active',
    type: 'deposit',
    title: 'Daily ROI - Aba Shoes',
    amount: 1200,
    createdAt: '5th April, 2025',
    category: 'earnings',
  },
  {
    user_id: '4',
    status: 'active',
    type: 'deposit',
    title: 'Daily ROI - Aba Shoes',
    amount: 1200,
    createdAt: '8th April, 2025',
    category: 'earnings',
  },
  {
    user_id: '6',
    status: 'active',
    type: 'deposit',
    title: 'Daily ROI - Balogun Traders',
    amount: 5000,
    createdAt: '7th April, 2025',
    category: 'earnings',
  },
  {
    user_id: '10',
    status: 'active',
    type: 'deposit',
    title: 'Daily ROI - Balogun Traders',
    amount: 5000,
    createdAt: '4th April, 2025',
    category: 'earnings',
  },
  {
    user_id: '11',
    status: 'active',
    type: 'deposit',
    title: 'Deposit from Bank',
    amount: 200000,
    createdAt: '10th Jan, 2024',
    category: 'deposit',
  },
];

export interface TransactionsSlice {
  transactions: ITransaction[];
  addTransaction: (transaction: Omit<ITransaction, 'id' | 'date'>) => void;
}

export const createTransactionsSlice: StateCreator<
  TransactionsSlice,
  [['zustand/immer', never]],
  [],
  TransactionsSlice
> = (set) => ({
  transactions: initialTransactions,
  addTransaction: (transaction) => {
    const newTransaction: ITransaction = {
      id: Date.now().toString(),
      ...transaction,
      createdAt: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    };
    set((state) => {
      state.transactions.unshift(newTransaction);
    });
  },
});
