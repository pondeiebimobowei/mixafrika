import { getRepaymentHistory } from '@/axios/repayment-history';
import { IRepaymentHistory } from '@mixafrica/shared/types/repayment-history';
import type { StateCreator } from 'zustand';

export interface RepaymentHistory {
  loading: boolean,
  error: string | null,
  repayment_history: IRepaymentHistory[];
  get_repayment_history: () => void;
}

export const createRepaymentHistory: StateCreator<
  RepaymentHistory,
  [],
  [],
  RepaymentHistory
> = (set) => ({
  loading: false,
  error: null,
  repayment_history: [],
  
  get_repayment_history: async () => {
      set({ loading: true, error: null });
      const response = await getRepaymentHistory();
      if (response.success) {
        set({ repayment_history: response.data });
      } else {
        set({ error: response.message });
      }
      set({ loading: false })
    },
});
