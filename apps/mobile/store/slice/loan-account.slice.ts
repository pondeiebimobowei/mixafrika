import { getLoanAccount } from '@/axios/loan_account';
import { ILoanAccount } from '@mixafrica/shared/types/loan-account';
import type { StateCreator } from 'zustand';

export interface LoanAccount {
  loading: boolean;
  error: string | null;
  loan_account: ILoanAccount | null;
  get_loan_account: ()=> void;
  set_loan_account: ({ loan_account }: { loan_account: ILoanAccount }) => void;
}

export const createLoanAccount: StateCreator<
  LoanAccount,
  [],
  [],
  LoanAccount
> = (set) => ({
  loading: false,
  error: null,
  loan_account: null,
  set_loan_account: ({ loan_account }) => {
    set({ loan_account });
  },
  get_loan_account: async () => {
      set({ loading: true, error: null });
      const response = await getLoanAccount();
      if (response.success) {
        set({
          loan_account: response.data,
          loading: false,
        });
      } else {
        set({ error: response.message, loading: false });
      }
    },
});

