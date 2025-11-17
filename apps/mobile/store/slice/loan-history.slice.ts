import { ILoanHistory } from '@mixafrica/shared/types/loan-history';
import type { StateCreator } from 'zustand';

export interface LoanHistory {
  history: ILoanHistory[];
  set_history: ({ history }: { history: ILoanHistory[] }) => void;
}

export const createLoanHistory: StateCreator<
  LoanHistory,
  [],
  [],
  LoanHistory
> = (set) => ({
  history: [],
  set_history: ({ history }) => {
    set({ history });
  },
});
