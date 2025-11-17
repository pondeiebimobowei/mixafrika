import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthSlice, createAuthSlice } from './slice/auth.slice';
import { secureStorage } from '@/utils/secure-storage';
import { createGoalsSlice, GoalsSlice } from './slice/goals.slice';
import {
  createNotificationsSlice,
  NotificationsSlice,
} from './slice/notifications.slice';
import {
  createTransactionsSlice,
  TransactionsSlice,
} from './slice/transactions.slice';
import { createLoanHistory, LoanHistory } from './slice/loan-history.slice';
import { createUserWallet, UserWallet } from './slice/wallet';
import { createLoanAccount, LoanAccount } from './slice/loan-account.slice';
import { createTraderRecord, TraderRecord } from './slice/trader.slice';
import { createUserBusiness, UserBusiness } from './slice/business.slice';

export interface BaseSlice {
  loading: boolean;
  error: string | null;
}

export const useAuthStore = create<AuthSlice>()(
  persist(
    immer((...a) => ({
      ...createAuthSlice(...a),
    })),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage),
    },
  ),
);

export const useUserBusiness = create<UserBusiness>()((...a) => ({
  ...createUserBusiness(...a),
}));

export const useTraderRecord = create<TraderRecord>()((...a) => ({
  ...createTraderRecord(...a),
}));

export const useLoanAccount = create<LoanAccount>()((...a) => ({
  ...createLoanAccount(...a),
}));

export const useWallet = create<UserWallet>()((...a) => ({
  ...createUserWallet(...a),
}));

export const useLoanHistory = create<LoanHistory>()((...a) => ({
  ...createLoanHistory(...a),
}));

export const useTransactionsStore = create<TransactionsSlice>()(
  immer((...a) => ({
    ...createTransactionsSlice(...a),
  })),
);

export const useNotificationsStore = create<NotificationsSlice>()(
  immer((...a) => ({
    ...createNotificationsSlice(...a),
  })),
);

export const useGoalsStore = create<GoalsSlice>()(
  immer((...a) => ({
    ...createGoalsSlice(...a),
  })),
);
