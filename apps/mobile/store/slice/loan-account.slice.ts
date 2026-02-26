import { getLoanAccount } from '@/axios/loan_account';
import { repayLoan } from '@/axios/wallet';
import { ILoanAccountWithCluster } from '@mixafrica/shared/types/loan-account';
import Toast from 'react-native-toast-message';
import type { StateCreator } from 'zustand';
import { useWallet } from '..';

export interface LoanAccount {
  loading: boolean;
  error: string | null;
  loan_account: ILoanAccountWithCluster | null;
  get_loan_account: ()=> void;
  set_loan_account: ({ loan_account }: { loan_account: ILoanAccountWithCluster }) => void;
  repay_loan: (amount: number) => Promise<boolean>;

}

export const createLoanAccount: StateCreator<
  LoanAccount,
  [],
  [],
  LoanAccount
> = (set, get) => ({
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

  repay_loan: async (amount: number) => {
    set({ loading: true, error: null });
    const { success, data, message } = await repayLoan(amount);


    if (success) {
      Toast.show({ text1: message, type: 'success'})
      set({ loan_account: data })
    } else {
      Toast.show({ text1: message, type: 'error'})
      set({ error: message });
    }
    
    get().get_loan_account()
    
    const fetchWalletBalance = useWallet.getState().getWalletBalance
    fetchWalletBalance();
    set({ loading: false });
    return success;
  }
});

