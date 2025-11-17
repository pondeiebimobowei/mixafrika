import { ILoanAccount } from '@mixafrica/shared/types/loan-account';
import type { StateCreator } from 'zustand';

export interface LoanAccount {
  loan_account: ILoanAccount | null;
  set_loan_account: ({ loan_account }: { loan_account: ILoanAccount }) => void;
}

export const createLoanAccount: StateCreator<
  LoanAccount,
  [],
  [],
  LoanAccount
> = (set) => ({
  loan_account: temp_data,
  set_loan_account: ({ loan_account }) => {
    set({ loan_account });
  },
});

const temp_data: ILoanAccount = {
  duration: 12,
  interest_rate: 5,
  recieved_amount: 1200,
  repaid_amount: 600,
  repayment_amount: 200,
  user_id: '',
};
