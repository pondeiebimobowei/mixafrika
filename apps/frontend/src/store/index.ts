
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from "zustand/middleware";
import { createAuthSlice, type AuthSlice } from './authSlice';
import { createTransactionsSlice, type TransactionsSlice } from './transactionsSlice';
import { createNotificationsSlice, type NotificationsSlice } from './notificationsSlice';
import { createGoalsSlice, type GoalsSlice } from './goalsSlice';
import { createUserBusiness, type UserBusiness } from './slice/business.slice';
import { createTraderRecord, type TraderRecord } from './slice/trader.slice';
import { createLoanAccount, type LoanAccount } from './slice/loan-account.slice';
import { createUserWallet, type UserWallet } from './slice/wallet';
import { createLoanHistory, type LoanHistory } from './slice/loan-history.slice';
import { createUserSlice, type UsersSlice } from './slice/user.slice';
import { createCollectionSlice, type CollectionSlice } from './slice/collection.slice';

export interface BaseSlice {
  loading: boolean,
  error: string | null
}

export const useAuthStore = create<AuthSlice>()(
    (...a) => ({
    ...persist(createAuthSlice, { name: "auth-storage"})(...a),
  })
);

export const useUserBusiness = create<UserBusiness>()((...a) => ({
  ...createUserBusiness(...a),
}))

export const useUsers = create<UsersSlice>()((...a) => ({
  ...createUserSlice(...a),
}))

export const useCollections = create<CollectionSlice>()((...a) => ({
  ...createCollectionSlice(...a),
}))

export const useTraderRecord = create<TraderRecord>()((...a) => ({
    ...createTraderRecord(...a),
}))

export const useLoanAccount = create<LoanAccount>()((...a) => ({
  ...createLoanAccount(...a),
}))

export const useWallet = create<UserWallet>()((...a) => ({
  ...createUserWallet(...a),
}))

export const useLoanHistory = create<LoanHistory>()((...a) => ({
  ...createLoanHistory(...a),
}))

export const useTransactionsStore = create<TransactionsSlice>()(
  immer((...a) => ({
    ...createTransactionsSlice(...a),
  }))
);

export const useNotificationsStore = create<NotificationsSlice>()(
  immer((...a) => ({
    ...createNotificationsSlice(...a),
  }))
);

export const useGoalsStore = create<GoalsSlice>()(
  immer((...a) => ({
    ...createGoalsSlice(...a),
  }))
);

export * from './authSlice';
export * from './transactionsSlice';
export * from './notificationsSlice';
export * from './goalsSlice';
